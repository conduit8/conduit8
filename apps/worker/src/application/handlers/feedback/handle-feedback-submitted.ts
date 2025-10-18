import { WebClient } from '@slack/web-api';

import type { EventHandler } from '@worker/application/handlers/types';
import type { FeedbackSubmitted } from '@worker/domain/messages/events';

import { WorkspaceRepository } from '@worker/infrastructure/persistence/repositories/workspace-installation-repository';
import { createFeedbackSuccessMessage } from '@worker/infrastructure/slack-ui/views/feedback-modal';

/**
 * Handles the FeedbackSubmitted event
 * Sends a success message to the user who submitted the feedback
 */
export const handleFeedbackSubmitted: EventHandler<FeedbackSubmitted> = async (event, env) => {
  const { userId, teamId, feedbackType } = event;

  console.log('Handling FeedbackSubmitted event', {
    feedbackId: event.feedbackId,
    userId,
    teamId,
    feedbackType,
  });

  try {
    // Get workspace installation to send the message
    const repository = new WorkspaceRepository(env.KV, env.D1);
    const installation = await repository.findByTeamId(teamId);

    if (!installation?.slackAccessToken) {
      console.error('No installation found for feedback notification', { teamId });
      return;
    }

    const slack = new WebClient(installation.slackAccessToken);

    // Send success message to the user
    const successMessage = createFeedbackSuccessMessage(userId);
    await slack.chat.postMessage({
      channel: userId,
      ...successMessage,
    });

    console.log('Feedback notification sent successfully', {
      userId,
      feedbackType,
    });
  }
  catch (error) {
    console.error('Failed to send feedback notification', {
      userId,
      teamId,
      error: String(error),
    });
    // Don't throw - we don't want to retry notification sends
  }
};
