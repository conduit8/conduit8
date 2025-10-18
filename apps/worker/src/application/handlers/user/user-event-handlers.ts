import { WebClient } from '@slack/web-api';
import { SlackMessagingService } from '@worker/domain/services/messaging';

import type { EventHandler } from '@worker/application/handlers/types';
import type { UserConfigurationUpdated } from '@worker/domain/messages/events';

import { UserService } from '@worker/domain/services/user-service';
import { WorkspaceRepository } from '@worker/infrastructure/persistence/repositories/workspace-installation-repository';

/**
 * Handles the UserConfigurationUpdated event
 * 1. Sends success message to user
 * 2. Updates app home
 * 3. Restarts container to apply new config
 */
export const handleUserConfigurationUpdated: EventHandler<UserConfigurationUpdated> = async (event, env) => {
  const { userId, teamId } = event;

  console.log('Handling UserConfigurationUpdated event', {
    userId,
    teamId,
  });

  try {
    // Get workspace installation for Slack access
    const repository = new WorkspaceRepository(env.KV, env.D1);
    const installation = await repository.findByTeamId(teamId);

    if (!installation?.slackAccessToken) {
      console.error('No installation found for config update notification', { teamId });
      return;
    }

    const slack = new WebClient(installation.slackAccessToken);

    // 1. Send success message to user (muted to avoid notification spam)
    await slack.chat.postMessage({
      channel: userId,
      blocks: [
        {
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: '✅ Your configuration has been updated successfully. Claude will use the new settings on your next message.',
          },
        },
      ],
      text: 'Configuration updated', // Fallback text - short to reduce notification noise
    });

    // 2. Update app home directly
    try {
      // Check user configuration status (should be configured now)
      const userService = UserService.create(env);
      const ready = await userService.isConfigured(userId);
      const status = ready ? 'READY' : 'NEEDS_SETUP';

      // Publish updated home view
      const slackService = new SlackMessagingService(slack);
      await slackService.publishAppHomeView(userId, status);

      console.log('App home updated after config', { userId, status });
    }
    catch (error) {
      console.error('Failed to update app home after config', {
        userId,
        error: String(error),
      });
    }

    // 3. Restart container to pick up new config
    try {
      const container = env.CLAUDE_RUNTIME.getByName(userId);

      // Restart to reload configuration
      await container.restart();

      console.log('Container restarted for config reload', { userId });
    }
    catch (error) {
      console.error('Failed to restart container after config', {
        userId,
        error: String(error),
      });
      // Don't fail - container will pick up new config on next start anyway
    }

    console.log('Configuration update handled successfully', {
      userId,
    });
  }
  catch (error) {
    console.error('Failed to handle configuration update', {
      userId,
      teamId,
      error: String(error),
    });
    // Don't throw - we don't want to retry these notifications
  }
};
