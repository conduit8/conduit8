import { WebClient } from '@slack/web-api';
import { SlackMessagingService } from '@worker/domain/services/messaging';

import type { CommandHandler } from '@worker/application/handlers/types';
import type { UpdateAppHome } from '@worker/domain/messages/commands';

import { UserService } from '@worker/domain/services/user-service';
import { WorkspaceRepository } from '@worker/infrastructure/persistence/repositories/workspace-installation-repository';

/**
 * Handler for UpdateAppHome command
 * Repurposed from handle-app-home-opened.ts
 *
 * Updates the Slack App Home tab for a user based on their configuration status
 */
export const updateAppHome: CommandHandler<UpdateAppHome, void> = async (command, env) => {
  const { teamId, userId } = command;

  try {
    // Get installation for Slack token
    const workspaceRepo = new WorkspaceRepository(env.KV, env.D1);
    const installation = await workspaceRepo.findByTeamId(teamId);

    if (!installation) {
      throw new Error(`No installation found for workspace ${teamId}`);
    }

    const slack = new SlackMessagingService(new WebClient(installation.slackAccessToken));

    // Check user configuration status
    const userService = UserService.create(env);
    const ready = await userService.isConfigured(userId);

    // Derive status: 'READY' if Configured, 'NEEDS_SETUP' if not
    const status = ready ? 'READY' : 'NEEDS_SETUP';

    console.log('Updating App Home', {
      userId,
      status,
    });

    // Update App Home UI
    await slack.publishAppHomeView(userId, status);

    return { result: undefined, events: [] };
  }
  catch (error) {
    console.error('Failed to handle app home opened', {
      userId,
      teamId,
      error: String(error),
    });
    // Don't throw - App Home errors shouldn't cause retries
    // The user can refresh the App Home if needed
    return { result: undefined, events: [] };
  }
};
