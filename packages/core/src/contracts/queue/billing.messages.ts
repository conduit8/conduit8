import { z } from 'zod';

import { baseEventSchema } from './base.messages';

// SubscriptionPurchased event schema (matches domain event)
export const subscriptionPurchasedSchema = baseEventSchema.extend({
  name: z.literal('SubscriptionPurchased'),
  userId: z.string(),
  amountCents: z.number().int().positive(),
  currency: z.string().length(3), // ISO 4217 currency code
  planType: z.string(), // Domain uses string, not enum
});

export type SubscriptionPurchasedMessage = z.infer<typeof subscriptionPurchasedSchema>;

// SubscriptionCancelled event schema (matches domain event)
export const subscriptionCancelledSchema = baseEventSchema.extend({
  name: z.literal('SubscriptionCancelled'),
  userId: z.string(),
  plan: z.string(),
});

export type SubscriptionCancelledMessage = z.infer<typeof subscriptionCancelledSchema>;
