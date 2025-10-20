import type { PostHog } from 'posthog-node';

import type { User } from '@worker/infrastructure/auth/types';
import type { DrizzleDb } from '@worker/infrastructure/persistence/database/types';

export interface AppContext {
  Variables: {
    // Auth context
    user?: User;
    userId?: string;
    slackAccessToken?: string;

    // Database context
    db?: DrizzleDb;
    d1Database?: D1Database;

    // Repository context - commented out until implemented
    // workspaceInstallationRepository?: IWorkspaceInstallationRepository;
    // userClaudeConfigRepository?: IUserRepository;
    // userSessionRepository?: IUserRepository;

    // Analytics & Observability
    posthog?: PostHog;
  };
  Bindings: Env;
}
