import { z } from 'zod';

import { baseEventSchema } from './base.messages';

// UserConfigurationUpdated event schema
export const userConfigurationUpdatedSchema = baseEventSchema.extend({
  name: z.literal('UserConfigurationUpdated'),
  userId: z.string(),
  teamId: z.string(),
  platform: z.string(),
  updatedAt: z.string().optional(),
});

export type UserConfigurationUpdated = z.infer<typeof userConfigurationUpdatedSchema>;

// FeedbackSubmitted event schema
export const feedbackSubmittedSchema = baseEventSchema.extend({
  name: z.literal('FeedbackSubmitted'),
  feedbackId: z.string(),
  userId: z.string(),
  teamId: z.string(),
  feedbackType: z.enum(['bug', 'feature']),
  message: z.string(),
  followUpEmail: z.string().email().optional(),
});

export type FeedbackSubmittedMessage = z.infer<typeof feedbackSubmittedSchema>;
