import { z } from 'zod';

import { TimestamptzSchema } from '../../types';
// Import all domain message schemas
import {
  sendMagicLinkSchema,
  trackUserSignupSchema,
} from './auth.messages';
import {
  conversationStartedSchema,
  conversationTurnCompletedSchema,
  conversationTurnFailedSchema,
  conversationTurnStartedSchema,
} from './conversation.messages';
// import {
//   subscriptionCancelledSchema,
//   subscriptionPurchasedSchema,
// } from './billing.messages';
import { r2EventNotificationSchema } from './r2.messages';
import {
  processThreadContextChangedSchema,
  processThreadStartedSchema,
  processUserMessageSchema,
  updateAppHomeSchema,
} from './slack.messages';
import {
  feedbackSubmittedSchema,
  userConfigurationUpdatedSchema,
} from './user.messages';

// Discriminated union of all domain messages (by name field)
export const domainMessageSchema = z.discriminatedUnion('name', [
  // Auth Commands
  sendMagicLinkSchema,
  trackUserSignupSchema,

  // Slack Commands
  processUserMessageSchema,
  processThreadStartedSchema,
  processThreadContextChangedSchema,
  updateAppHomeSchema,

  // Events
  conversationStartedSchema,
  conversationTurnCompletedSchema,
  conversationTurnStartedSchema,
  conversationTurnFailedSchema,
  feedbackSubmittedSchema,
  userConfigurationUpdatedSchema,

]);

// Wrapped domain messages (what we send to queue)
const wrappedDomainMessageSchema = z.object({
  version: z.literal(1).default(1),
  timestamp: TimestamptzSchema,
  payload: domainMessageSchema,
});

// Queue can receive either wrapped domain messages OR raw R2 events
export const queueMessageSchema = z.union([
  wrappedDomainMessageSchema,
  r2EventNotificationSchema, // Transforms raw R2 to domain shape
]);

// Type exports
export type DomainMessage = z.infer<typeof domainMessageSchema>;
export type QueueMessage = z.infer<typeof queueMessageSchema>;
