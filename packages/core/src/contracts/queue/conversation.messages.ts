import { z } from 'zod';

import { baseEventSchema } from './base.messages';

// ConversationStarted event schema
export const conversationStartedSchema = baseEventSchema.extend({
  name: z.literal('ConversationStarted'),
  conversationId: z.string(),
  platformUserId: z.string(),
  platform: z.literal('slack'),
  channel: z.string(),
  threadTs: z.string(),
  startedAt: z.string().optional(),
});

export type ConversationStarted = z.infer<typeof conversationStartedSchema>;

// ConversationTurnStarted event schema
export const conversationTurnStartedSchema = baseEventSchema.extend({
  name: z.literal('ConversationTurnStarted'),
  conversationId: z.string(),
  userId: z.string(),
  sessionId: z.string().optional(),
  message: z.string(),
  startedAt: z.string().optional(),
});

export type ConversationTurnStarted = z.infer<typeof conversationTurnStartedSchema>;

// ConversationTurnCompleted event schema
export const conversationTurnCompletedSchema = baseEventSchema.extend({
  name: z.literal('ConversationTurnCompleted'),
  conversationId: z.string(),
  userId: z.string(),
  sessionId: z.string(),
  previousSessionId: z.string().optional(),
  sessionChanged: z.boolean(),
  cost: z.number().optional(),
  completedAt: z.string().optional(),
});

export type ConversationTurnCompleted = z.infer<typeof conversationTurnCompletedSchema>;

// ConversationTurnFailed event schema
export const conversationTurnFailedSchema = baseEventSchema.extend({
  name: z.literal('ConversationTurnFailed'),
  conversationId: z.string(),
  userId: z.string(),
  teamId: z.string(),
  channel: z.string(),
  threadTs: z.string(),
  sessionId: z.string().optional(),
  errMsg: z.string().optional(),
});

export type ConversationTurnFailed = z.infer<typeof conversationTurnFailedSchema>;
