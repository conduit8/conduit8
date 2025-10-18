import { z } from 'zod';

import { baseCommandSchema } from './base.messages';

// ProcessUserMessage command schema
export const processUserMessageSchema = baseCommandSchema.extend({
  name: z.literal('ProcessUserMessage'),
  teamId: z.string(),
  userId: z.string(),
  channel: z.string(),
  message: z.string().optional(),
  threadTs: z.string().optional(),
});

export type ProcessUserMessageMessage = z.infer<typeof processUserMessageSchema>;

// ProcessThreadStarted command schema
export const processThreadStartedSchema = baseCommandSchema.extend({
  name: z.literal('ProcessThreadStarted'),
  teamId: z.string(),
  userId: z.string(),
  channel: z.string(),
  threadTs: z.string(),
});

export type ProcessThreadStartedMessage = z.infer<typeof processThreadStartedSchema>;

// UpdateAppHome command schema
export const updateAppHomeSchema = baseCommandSchema.extend({
  name: z.literal('UpdateAppHome'),
  teamId: z.string(),
  userId: z.string(),
});

export type UpdateAppHomeMessage = z.infer<typeof updateAppHomeSchema>;

// ProcessThreadContextChanged command schema
export const processThreadContextChangedSchema = baseCommandSchema.extend({
  name: z.literal('ProcessThreadContextChanged'),
  teamId: z.string(),
  userId: z.string(),
  channel: z.string(),
  threadTs: z.string(),
});

export type ProcessThreadContextChangedMessage = z.infer<typeof processThreadContextChangedSchema>;
