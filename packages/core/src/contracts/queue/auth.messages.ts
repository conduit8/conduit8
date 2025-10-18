import { z } from 'zod';

import { baseCommandSchema } from './base.messages';

// SendMagicLink command schema
export const sendMagicLinkSchema = baseCommandSchema.extend({
  name: z.literal('SendMagicLink'),
  email: z.email(),
  magicLinkUrl: z.url(),
  token: z.string(),
});

export type SendMagicLinkMessage = z.infer<typeof sendMagicLinkSchema>;

// TrackUserSignup command schema
export const trackUserSignupSchema = baseCommandSchema.extend({
  name: z.literal('TrackUserSignup'),
  userId: z.string(),
});

export type TrackUserSignupMessage = z.infer<typeof trackUserSignupSchema>;
