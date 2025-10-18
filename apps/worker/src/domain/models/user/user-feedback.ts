import { z } from 'zod';

/**
 * Schema for user feedback validation
 */
export const UserFeedbackSchema = z.object({
  feedbackType: z.enum(['bug', 'feature']),
  message: z.string().min(10, 'Feedback must be at least 10 characters').max(1000, 'Feedback must be less than 1000 characters'),
  followUpEmail: z.email('Invalid email format').optional(),
});

export type UserFeedback = z.infer<typeof UserFeedbackSchema>;
