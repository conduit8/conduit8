import type { BaseMessage } from '@worker/domain/messages/base';

import {
  ProcessThreadContextChanged,
  ProcessThreadStarted,
  ProcessUserMessage,
  SendMagicLink,
  TrackUserSignup,
  UpdateAppHome,
} from '@worker/domain/messages/commands';
import {
  ConversationStarted,
  ConversationTurnCompleted,
  ConversationTurnFailed,
  ConversationTurnStarted,
  FeedbackSubmitted,
  R2UploadCompleteNotification,
  UserConfigurationUpdated,
} from '@worker/domain/messages/events';

// Registry maps message names to domain message constructors
// Used to reconstruct domain objects from parsed contract data
export const MESSAGE_CONSTRUCTORS: Record<string, (msg: any) => BaseMessage> = {
  // Auth Commands
  'SendMagicLink': msg => new SendMagicLink(msg.email, msg.magicLinkUrl, msg.token),
  'TrackUserSignup': msg => new TrackUserSignup(msg.userId),

  // Slack Commands
  'ProcessUserMessage': msg => new ProcessUserMessage(
    msg.teamId,
    msg.userId,
    msg.channel,
    msg.message, // Changed from msg.text to msg.message
    msg.threadTs,
  ),
  'ProcessThreadStarted': msg => new ProcessThreadStarted(
    msg.teamId,
    msg.userId,
    msg.channel,
    msg.threadTs,
  ),
  'ProcessThreadContextChanged': msg => new ProcessThreadContextChanged(
    msg.teamId,
    msg.userId,
    msg.channel,
    msg.threadTs,
  ),
  'UpdateAppHome': msg => new UpdateAppHome(msg.teamId, msg.userId),

  'R2UploadCompleteNotification': msg =>
    new R2UploadCompleteNotification(msg.fileKey, msg.eventTime, msg.action),

  // Conversation Events
  'ConversationStarted': msg => new ConversationStarted(
    msg.conversationId,
    msg.platformUserId,
    msg.platform,
    msg.channel,
    msg.threadTs,
    msg.startedAt,
  ),
  'ConversationTurnStarted': msg => new ConversationTurnStarted(
    msg.conversationId,
    msg.userId,
    msg.sessionId,
    msg.message,
    msg.startedAt,
  ),
  'ConversationTurnCompleted': msg => new ConversationTurnCompleted(
    msg.conversationId,
    msg.userId,
    msg.sessionId,
    msg.previousSessionId,
    msg.sessionChanged,
    msg.cost,
    msg.completedAt,
  ),

  'ConversationTurnFailed': msg => new ConversationTurnFailed(
    msg.conversationId,
    msg.userId,
    msg.teamId,
    msg.channel,
    msg.threadTs,
    msg?.sessionId,
    msg?.errMsg,
  ),

  // Feedback Event
  'FeedbackSubmitted': msg => new FeedbackSubmitted(
    msg.feedbackId,
    msg.userId,
    msg.teamId,
    msg.feedbackType,
    msg.message,
    msg.followUpEmail,
  ),

  'UserConfigurationUpdated': msg => new UserConfigurationUpdated(
    msg.userId,
    msg.teamId,
    msg.platform,
    msg?.updatedAt,
  ),

  // R2 event mapping - only handle PutObject for now
  'r2:PutObject': msg => new R2UploadCompleteNotification(msg.object.key, msg.eventTime, msg.action),
  // Ignore other R2 actions - we don't process them
};
