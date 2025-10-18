import { SlackMessagingService } from '@worker/domain/services/messaging';

import type { EventHandler } from '@worker/application/handlers/types';
import type { ConversationTurnCompleted, ConversationTurnFailed } from '@worker/domain/messages/events';

import { ConversationRepository } from '@worker/infrastructure/persistence/repositories/conversation-repository';
/**
 * Handle conversation turn failure events
 */
export const handleConversationFailed: EventHandler<ConversationTurnFailed> = async (
  event: ConversationTurnFailed,
  env: Env,
) => {
  const slack = await SlackMessagingService.create(event.teamId, env);

  // // Send error message as muted (context block)
  // const errorMessage = event.errMsg || 'An error occurred processing your message';
  // await slack.postMessage(
  //   event.channel,
  //   `⚠️ ${errorMessage}`,
  //   [
  //     {
  //       type: 'context',
  //       elements: [
  //         {
  //           type: 'mrkdwn',
  //           text: `⚠️ *Error occurred:* ${errorMessage}`,
  //         },
  //       ],
  //     },
  //   ],
  //   event.threadTs,
  // );

  // Clear the thread status
  await slack.clearThreadStatus(event.channel, event.threadTs);
};

/**
 * Event handler that persists Claude session history from container to R2
 * Triggered when a conversation turn is completed with a valid session ID
 */
export const persistSessionHistory: EventHandler<ConversationTurnCompleted> = async (
  event: ConversationTurnCompleted,
  env: Env,
) => {
  const { userId, sessionId, previousSessionId } = event;

  try {
    // Create repository
    const conversationRepo = ConversationRepository.create(env);

    // Get runtime for user
    const runtimeId = env.CLAUDE_RUNTIME.idFromName(userId);
    const runtime = env.CLAUDE_RUNTIME.get(runtimeId);

    // Fetch session data from container via RPC
    // TODO: This should be a proper RPC method, not a direct HTTP call
    const response = await runtime.fetch(
      new Request(`http://container/session/${sessionId}`),
    );

    if (!response.ok) {
      console.error('Failed to fetch session from container', {
        userId,
        sessionId,
        status: response.status,
        statusText: response.statusText,
      });
      throw new Error(`Failed to fetch session ${sessionId} from container: ${response.status}`);
    }

    // Extract required headers from container response
    const projectId = response.headers.get('X-Project-Id');
    const responseSessionId = response.headers.get('X-Session-Id');

    if (!projectId || !responseSessionId) {
      console.error('Missing required headers from container response', {
        userId,
        sessionId,
        projectId,
        responseSessionId,
      });
      throw new Error(
        `Missing required headers from container: X-Project-Id=${projectId}, X-Session-Id=${responseSessionId}`,
      );
    }

    // Verify session ID matches request
    if (responseSessionId !== sessionId) {
      console.error('Session ID mismatch between request and response', {
        userId,
        requestedSessionId: sessionId,
        responseSessionId,
      });
      throw new Error(
        `Session ID mismatch: requested ${sessionId}, received ${responseSessionId}`,
      );
    }

    // Save session history to R2
    const sessionData = await response.arrayBuffer();
    await conversationRepo.saveSessionHistory(userId, sessionId, sessionData, projectId);

    console.log('Session history saved to R2', {
      userId,
      sessionId,
      projectId,
      sizeBytes: sessionData.byteLength,
    });

    // Delete old session if this is a session branch (Claude creates new sessions when resuming)
    if (previousSessionId && previousSessionId !== sessionId) {
      try {
        await conversationRepo.deleteSessionHistory(userId, previousSessionId);
      }
      catch (deleteError) {
        // Don't fail the whole operation if cleanup fails
        console.warn('Failed to delete old session, continuing', {
          userId,
          previousSessionId,
          error: String(deleteError),
        });
      }
    }
  }
  catch (error) {
    console.error('Failed to persist session history', {
      userId,
      sessionId,
      error: error instanceof Error ? error.message : String(error),
    });

    // Don't throw - this is a background operation that shouldn't fail the main flow
    // The session is already saved in the conversation record
  }
};
