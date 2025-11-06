import type { OAuthHelpers } from '@cloudflare/workers-oauth-provider';
import type { PostHog } from 'posthog-node';

export interface AppContext {
  Variables: {
    // Auth context
    // TODO: maybe we will need anything

    // Analytics & Observability
    posthog?: PostHog;
  };
  Bindings: Env & {
    OAUTH_PROVIDER: OAuthHelpers;
  };
}
