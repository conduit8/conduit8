import type { State } from '@cloudflare/containers';

import { Container } from '@cloudflare/containers';
import { PostHogAnalyticsService } from '@worker/infrastructure/services/analytics';
import { env } from 'cloudflare:workers';

export class ClaudeRuntime extends Container {
  defaultPort = 8080;

  // 20 min without any activity
  sleepAfter = '20m';

  // enable internet so that it can do web searches
  enableInternet = true;

  envVars = {
    // Environment indicator for container to make decisions
    ENVIRONMENT: env.ENV,
    // Claude SDK working directory (static for all instances)
    CWD: '/workspace',
  };

  override async onStart(): Promise<void> {
    console.info('Claude Runtime onStart called');
  }

  override async onStop(): Promise<void> {
    console.info('Claude Runtime onStop called');
  }

  override onError(error: unknown): void {
    console.info('Claude Runtime onError called with error', error || 'no error info provided');

    // Track container crashes only (fire and forget, don't slow down)
    const analytics = new PostHogAnalyticsService(env);
    analytics.track('container_crash', this.ctx.id.toString(), {
      error_message: error instanceof Error ? error.message : String(error),
    });
    // Fire and forget - don't await in onError
    analytics.shutdown().catch(() => {});
  }

  // Attempts to reload env vars from storage
  private async reloadEnvVars(): Promise<boolean> {
    const stored = await this.ctx.storage.get<Record<string, string>>('userEnvVars');
    if (stored) {
      this.envVars = { ...this.envVars, ...stored };
      console.debug('Loaded env vars from storage');
      return true;
    }
    return false;
  }

  private async ensureEnvVars(): Promise<void> {
    const envs = this.envVars as any;
    if (!envs.ANTHROPIC_API_KEY || !envs.GH_TOKEN) {
      const set = await this.reloadEnvVars();
      if (!set) {
        throw new Error('Container not allowed to start - missing required environment variables');
      }
    }
  }

  // Set and persist env vars
  async persistEnvVars(userEnvVars: Record<string, string>): Promise<void> {
    // Persist to DO storage
    await this.ctx.storage.put('userEnvVars', userEnvVars);

    // Apply to current instance
    this.envVars = { ...this.envVars, ...userEnvVars };

    console.debug(`Set ${Object.keys(userEnvVars).length} user env vars (${Object.keys(this.envVars).length} total)`);
  }

  // Get container state
  async getContainerHealth(): Promise<State> {
    const state = await this.getState();
    console.debug('Container state:', state);
    return state;
  }

  // Restore session to container via RPC
  async restoreSession(
    sessionId: string,
    projectId: string,
    sessionData: ArrayBuffer,
  ): Promise<boolean> {
    // Build request for container - using container routing, not localhost
    const request = new Request('http://container/sessions/restore', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/x-ndjson',
        'X-Session-Id': sessionId,
        'X-Project-Id': projectId,
      },
      body: sessionData,
    });

    // Use our overridden fetch which ensures container is ready
    const response = await this.fetch(request);

    if (!response.ok) {
      console.error('Container rejected session restoration', {
        sessionId,
        projectId,
        status: response.status,
      });
      return false;
    }

    console.log('Session restored to container', {
      sessionId,
      projectId,
      sizeBytes: sessionData.byteLength,
    });

    return true;
  }

  // Override fetch to ensure proper container state
  override async fetch(request: Request): Promise<Response> {
    // Ensure env vars are set if they exist in storage
    await this.ensureEnvVars();
    // Start and wait for ports
    await this.startAndWaitForPorts();

    // 3. Forward the request
    return super.fetch(request);
  }

  // Restart container to pick up new configuration
  async restart(): Promise<void> {
    console.log('Restarting container to apply new configuration');

    try {
      // Stop the container if running
      const state = await this.getState();
      if (state.status === 'stopped') {
        console.log('Container already stopped - will use new config on next start');
        return;
      }

      await this.stop();
      console.log('Container stopped');

      // Reload env vars from storage (in case they changed)
      await this.reloadEnvVars();

      // Start container with new env vars
      await this.startAndWaitForPorts();
      console.log('Container restarted with new configuration');
    }
    catch (error) {
      console.error('Failed to restart container', error);
      throw error;
    }
  }
}
