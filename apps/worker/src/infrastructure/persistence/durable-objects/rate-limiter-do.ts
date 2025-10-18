import { DurableObject } from 'cloudflare:workers';

interface RateLimit {
  key: string;
  count: number;
  lastRequest: number;
}

export class RateLimiterDO extends DurableObject<Env> {
  constructor(ctx: DurableObjectState, env: Env) {
    super(ctx, env);
  }

  // Public RPC method - get rate limit data
  async getRateLimit(): Promise<RateLimit | undefined> {
    const data = await this.ctx.storage.get<RateLimit>('data');
    console.log(`[DO] getRateLimit - key: ${data?.key || 'none'}, count: ${data?.count || 0}`);
    return data;
  }

  // Public RPC method - set rate limit data
  async setRateLimit(value: RateLimit): Promise<void> {
    console.log(
      `[DO] setRateLimit - key: ${value.key}, count: ${value.count}, lastRequest: ${new Date(value.lastRequest).toISOString()}`,
    );
    await this.ctx.storage.put('data', value);

    // Set alarm to cleanup 1 hour after last activity
    // Better Auth windows are typically 10-60 seconds, so 1 hour is plenty
    const cleanupTime = Date.now() + 60 * 60 * 1000; // 1 hour
    await this.ctx.storage.setAlarm(cleanupTime);
  }

  // Alarm handler for cleanup
  async alarm() {
    await this.ctx.storage.deleteAll();
  }
}
