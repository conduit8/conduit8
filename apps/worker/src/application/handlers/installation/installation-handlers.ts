import type { CommandHandler } from '@worker/application/handlers/types';
import type { InstallSlackApp } from '@worker/domain/messages/commands';

import { WorkspaceInstallation } from '@worker/domain/models/installation/workspace-installation';
import { WorkspaceRepository } from '@worker/infrastructure/persistence/repositories/workspace-installation-repository';
import { PostHogAnalyticsService } from '@worker/infrastructure/services/analytics/posthog-analytics-service';
import { SlackClient } from '@worker/infrastructure/services/slack/slack-client';

/**
 * Handler for InstallSlackApp command
 *
 * Flow:
 * 1. Exchange OAuth code for tokens
 * 2. Create WorkspaceInstallation aggregate (validates and emits SlackAppInstalled event)
 * 3. Check for existing installation (update scenario)
 * 4. Save installation
 * 5. Return installation with events
 */
export const installSlackApp: CommandHandler<InstallSlackApp, WorkspaceInstallation> = async (
  command,
  env,
) => {
  // Initialize services
  const slackClient = new SlackClient(env);
  const repository = new WorkspaceRepository(env.KV, env.D1);

  // 1. Exchange OAuth code for tokens
  console.info('Exchanging OAuth code for tokens');
  const oauthResponse = await slackClient.getAccessResponse(command.oauthCode);

  // 2. Create domain aggregate (validates and emits SlackAppInstalled event)
  const installation = WorkspaceInstallation.create(oauthResponse);

  // 3. Save installation (upsert)
  const saved = await repository.save(installation);

  console.info('Workspace installation completed', {
    teamId: saved.teamId,
    teamName: saved.teamName,
    isEnterpriseGrid: !!saved.enterpriseId,
  });

  // Track analytics (non-blocking, don't fail main flow)
  try {
    const analytics = new PostHogAnalyticsService(env);
    analytics.track('app_installed', saved.authedUserId ?? `team:${saved.teamId}`, {
      team_id: saved.teamId,
      team_name: saved.teamName,
      installer_user_id: saved.authedUserId,
      is_enterprise: !!saved.enterpriseId,
    });
    await analytics.shutdown();
  }
  catch (error) {
    console.error('[Analytics] Failed to track app_installed:', error);
    // Don't throw - analytics should never break main functionality
  }

  // 4. Return saved installation with events
  const events = installation.collectEvents();
  return {
    result: saved,
    events,
  };
};
