/**
 * PostHog analytics integration
 * Anonymous telemetry for CLI usage tracking
 */
import { randomUUID } from 'node:crypto';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { homedir } from 'node:os';
import { join } from 'node:path';
import { PostHog } from 'posthog-node';

// Baked-in PostHog API key for conduit8 CLI
const POSTHOG_API_KEY = 'phc_NDBbVulJLDOWxw7rbHOpZP1eYq4j3iJmnzGvf9rJDRS';
const POSTHOG_HOST = 'https://us.posthog.com';

let posthogClient: PostHog | null = null;

/**
 * Config file path for storing anonymous ID
 * ~/.conduit8/config.json
 */
const CONFIG_DIR = join(homedir(), '.conduit8');
const CONFIG_FILE = join(CONFIG_DIR, 'config.json');

interface Config {
  telemetry: {
    enabled: boolean;
    anonymousId: string;
  };
}

/**
 * Get or create anonymous user ID
 * Stored in ~/.conduit8/config.json for persistence
 */
function getAnonymousId(): string {
  try {
    // Ensure config directory exists
    if (!existsSync(CONFIG_DIR)) {
      mkdirSync(CONFIG_DIR, { recursive: true });
    }

    // Read or create config
    let config: Config;
    if (existsSync(CONFIG_FILE)) {
      const content = readFileSync(CONFIG_FILE, 'utf-8');
      config = JSON.parse(content);
    }
    else {
      config = {
        telemetry: {
          enabled: true,
          anonymousId: randomUUID(),
        },
      };
      writeFileSync(CONFIG_FILE, JSON.stringify(config, null, 2));
    }

    // Ensure anonymousId exists
    if (!config.telemetry?.anonymousId) {
      config.telemetry = {
        ...config.telemetry,
        anonymousId: randomUUID(),
      };
      writeFileSync(CONFIG_FILE, JSON.stringify(config, null, 2));
    }

    return config.telemetry.anonymousId;
  }
  catch {
    // Fallback: generate ephemeral ID if file operations fail
    return randomUUID();
  }
}

/**
 * Initialize PostHog for usage tracking
 * @param telemetryEnabled - Whether telemetry is enabled (default: true)
 */
export function initPostHog(telemetryEnabled: boolean = true): void {
  // Skip initialization if telemetry disabled
  if (!telemetryEnabled) {
    return;
  }

  try {
    posthogClient = new PostHog(POSTHOG_API_KEY, {
      host: POSTHOG_HOST,
      flushAt: 1, // Flush immediately for CLI (not batching)
      flushInterval: 0, // No interval flushing
    });
  }
  catch {
    // Silently fail - never disrupt user
    posthogClient = null;
  }
}

/**
 * Check if PostHog is enabled
 */
export function isPostHogEnabled(): boolean {
  return posthogClient !== null;
}

/**
 * Track an event
 * Fire-and-forget - never blocks or throws
 */
export function trackEvent(
  event: string,
  properties?: Record<string, unknown>,
): void {
  if (!posthogClient) {
    return;
  }

  try {
    posthogClient.capture({
      distinctId: getAnonymousId(),
      event,
      properties: {
        ...properties,
        cli_version: __VERSION__,
        os: process.platform,
      },
    });
  }
  catch {
    // Silently fail - never disrupt user
  }
}

/**
 * Flush PostHog events before exit
 * Critical for CLI to ensure events are sent
 */
export async function flushPostHog(): Promise<void> {
  if (!posthogClient) {
    return;
  }

  try {
    await posthogClient.shutdown();
  }
  catch {
    // Silently fail
  }
}
