import { settings } from '@web/lib/settings';
import posthog from 'posthog-js';

// Initialize PostHog
posthog.init(settings.posthog.apiKey, {
  api_host: settings.posthog.apiHost,
});

export { posthog };
