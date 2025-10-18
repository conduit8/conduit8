import { SlackMessagingService } from '@worker/domain/services/messaging';

import type { CommandHandler } from '@worker/application/handlers/types';
import type { ProcessThreadStarted } from '@worker/domain/messages/commands';

import { UserService } from '@worker/domain/services/user-service';

/**
 * Handler for ProcessThreadStarted command
 * Triggered when a user starts an Assistant thread in Slack
 * Checks configuration and shows appropriate message
 */
export const handleThreadStarted: CommandHandler<ProcessThreadStarted, void> = async (command, env) => {
  const { teamId, userId, channel, threadTs } = command;
  const startTime = Date.now();

  // Create Slack service
  const slack = await SlackMessagingService.create(teamId, env);

  // Check user configuration (domain logic)
  const userService = UserService.create(env);
  const user = await userService.getUser(userId);
  const ready = !!user;

  // Send appropriate message based on configuration status
  await slack.sendThreadStartedMessage(
    ready,
    userId,
    channel,
    threadTs,
  );

  console.log('Thread started handler complete', {
    userId,
    threadTs,
    duration_ms: Date.now() - startTime,
  });

  return { result: undefined, events: [] };
};
