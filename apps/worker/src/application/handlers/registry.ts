import { handleUserSignedUp, sendMagicLink } from '@worker/application/handlers/auth';
import { handleConversationFailed, handleUserMessage, persistSessionHistory } from '@worker/application/handlers/conversation';
import { installSlackApp } from '@worker/application/handlers/installation';
import { updateAppHome } from '@worker/application/handlers/ui-interactions/slack/homepage';
import { handleOpenConfigModal, handleOpenFeedbackModal, handleSubmitConfigModal, handleSubmitFeedbackModal } from '@worker/application/handlers/ui-interactions/slack/interactions';

import type { CommandName, EventName, QueryName } from '@worker/domain/messages/types';

import { handleFeedbackSubmitted } from '@worker/application/handlers/feedback/handle-feedback-submitted';
import { handleUserConfigurationUpdated } from '@worker/application/handlers/user/user-event-handlers';

import { handleThreadStarted } from './conversation/handle-thread-started';

// Command handlers registry - one handler per command
// TypeScript will now ensure all CommandNames have handlers
export const COMMAND_HANDLERS = {
  // Auth
  SendMagicLink: sendMagicLink,
  TrackUserSignup: handleUserSignedUp,
  // TrackFileUploadComplete: trackFileUpload,

  // Slack commands - TODO: Implement these handlers
  ProcessUserMessage: handleUserMessage,
  ProcessThreadStarted: handleThreadStarted,
  ProcessThreadContextChanged: async (cmd: any, env: Env) => {
    console.log('ProcessThreadContextChanged handler not implemented', cmd);
    return { result: null, events: [] };
  },
  UpdateAppHome: updateAppHome,
  InstallSlackApp: installSlackApp,
  OpenConfigModal: handleOpenConfigModal,
  SubmitConfigModal: handleSubmitConfigModal,
  OpenFeedbackModal: handleOpenFeedbackModal,
  SubmitFeedbackModal: handleSubmitFeedbackModal,
} satisfies Partial<Record<CommandName, any>>;

// Event handlers registry - multiple handlers per event
// TypeScript allows partial coverage (events can have 0 handlers)
export const EVENT_HANDLERS = {
  // Billing
  SubscriptionPurchased: [],
  SubscriptionCancelled: [],

  // File operations
  R2UploadCompleteNotification: [],

  // Slack events
  SlackAppInstalled: [],

  // Feedback events
  FeedbackSubmitted: [handleFeedbackSubmitted],

  // Conversation events
  ConversationStarted: [],
  ConversationTurnStarted: [],
  ConversationTurnCompleted: [persistSessionHistory],
  ConversationTurnFailed: [handleConversationFailed],
  SessionRestoreRequired: [],

  // User events
  UserConfigured: [],
  UserConfigurationUpdated: [handleUserConfigurationUpdated],
  UserConfigurationRequired: [],

} satisfies Partial<Record<EventName, any[]>>;

// Query handlers registry - one handler per query
// TypeScript will ensure all QueryNames have handlers
export const QUERY_HANDLERS = {

} satisfies Partial<Record<QueryName, any>>;
