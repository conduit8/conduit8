import { z } from 'zod';

import { TimestamptzSchema } from '../../types/datetime.types';

// Base schemas for domain messages (matching domain/messages/base.ts)

// Base command schema
export const baseCommandSchema = z.object({
  type: z.literal('command'),
  name: z.string().min(1),
});

// Base event schema
export const baseEventSchema = z.object({
  type: z.literal('event'),
  name: z.string().min(1),
  async: z.boolean().default(true),
  id: z.uuidv4(),
  timestamp: TimestamptzSchema,
});

// Base query schema
export const baseQuerySchema = z.object({
  type: z.literal('query'),
  name: z.string().min(1),
});
