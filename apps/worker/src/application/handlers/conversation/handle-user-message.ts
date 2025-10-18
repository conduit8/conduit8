import { SlackMessagingService } from '@worker/domain/services/messaging';
import { ConversationRepository } from '@worker/infrastructure/persistence/repositories';

import type { ProcessUserMessage } from '@worker/domain/messages/commands';

import { ClaudeChatService } from '@worker/domain/services/chat-service/claude-chat-service';
import { PostHogAnalyticsService } from '@worker/infrastructure/services/analytics/posthog-analytics-service';

import type { CommandHandler } from '../types';

// Command handler that orchestrates user message processing
export const handleUserMessage: CommandHandler<ProcessUserMessage, void> = async (
  cmd: ProcessUserMessage,
  env: Env,
) => {
  const startTime = Date.now();

  console.log('Processing Slack message', {
    userId: cmd.userId,
    channel: cmd.channel,
    threadTs: cmd.threadTs,
    messagePreview: cmd.message?.substring(0, 50) || '',
  });

  // Track message received
  try {
    const analytics = new PostHogAnalyticsService(env);
    analytics.track('message_received', cmd.userId, {
      team_id: cmd.teamId,
      message_length: cmd.message?.length || 0,
      channel: cmd.channel,
    });
    await analytics.shutdown();
  }
  catch (error) {
    console.error('[Analytics] Failed to track message_received:', error);
  }

  // Get/create conversation
  const conversationRepo = ConversationRepository.create(env);

  let conversation = await conversationRepo.findOrCreate(
    cmd.userId,
    {
      platform: 'slack',
      channel: cmd.channel,
      threadTs: cmd.threadTs || 'direct',
    },
  );

  // Start the turn (adds ConversationTurnStarted event to conversation)
  conversation = conversation.startTurn(cmd.message);

  // Setup Claude runtime and stream response
  const chatService = await ClaudeChatService.create(env, cmd.userId);

  // Track partial session ID in case of mid-stream failure
  let partialSessionId: string | undefined;

  try {
    // Process message and return a generator
    const streamGenerator = chatService.processMessage(cmd.message || '', conversation.claudeSessionId);

    // Create slack messaging service once
    const slack = await SlackMessagingService.create(cmd.teamId, env);

    // Pass the full generator to Slack service to handle UI concerns
    // Slack service will maintain its own state for status updates, etc.
    // This will throw if stream doesn't complete with a session ID
    const { sessionId: finalSessionId, cost } = await slack.handleConversationMessages(
      streamGenerator,
      cmd.userId,
      cmd.channel,
      cmd.threadTs,
    );

    // Success path - we have a valid session ID
    const updated = conversation.completeTurn(finalSessionId, cost);
    await conversationRepo.save(updated);

    // Track success
    try {
      const analytics = new PostHogAnalyticsService(env);
      analytics.track('message_processed', cmd.userId, {
        team_id: cmd.teamId,
        conversation_id: conversation.id,
        success: true,
        duration_ms: Date.now() - startTime,
        cost_usd: cost || 0,
      });
      await analytics.shutdown();
    }
    catch (error) {
      console.error('[Analytics] Failed to track message_processed:', error);
    }

    return {
      result: undefined,
      events: updated.collectEvents(), // Contains both startTurn and completeTurn events
    };
  }
  catch (error) {
    // Error occurred - may have partial response already sent to user
    console.error('Error processing user message', {
      userId: cmd.userId,
      channel: cmd.channel,
      threadTs: cmd.threadTs,
      partialSessionId,
      error: error instanceof Error ? error.message : String(error),
    });

    // Fail the turn with any partial session we captured
    // If partialSessionId exists, user saw some response before failure
    const failed = conversation.failTurn(
      cmd.teamId,
      partialSessionId,
      error instanceof Error ? error.message : String(error),
    );
    await conversationRepo.save(failed);

    // Track failure
    try {
      const errorMessage = error instanceof Error ? error.message : String(error);
      const analytics = new PostHogAnalyticsService(env);
      analytics.track('message_processed', cmd.userId, {
        team_id: cmd.teamId,
        conversation_id: conversation.id,
        success: false,
        duration_ms: Date.now() - startTime,
        error_message: errorMessage,
      });
      await analytics.shutdown();
    }
    catch (trackingError) {
      console.error('[Analytics] Failed to track message_processed error:', trackingError);
    }

    return {
      result: undefined,
      events: failed.collectEvents(), // Contains startTurn and failTurn events
    };
  }
};
