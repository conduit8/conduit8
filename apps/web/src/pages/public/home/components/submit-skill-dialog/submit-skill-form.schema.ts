import { SKILL_CATEGORIES } from '@conduit8/core';
import { z } from 'zod';

/**
 * Validation schema for skill submission form
 * Validates user input before submitting to backend
 */
export const submitSkillFormSchema = z.object({
  displayName: z
    .string()
    .min(3, 'Display name must be at least 3 characters')
    .max(100, 'Display name must not exceed 100 characters')
    .regex(/^[a-zA-Z0-9\s\-_]+$/, 'Display name can only contain letters, numbers, spaces, hyphens, and underscores'),

  description: z
    .string()
    .min(20, 'Description must be at least 20 characters')
    .max(500, 'Description must not exceed 500 characters'),

  category: z
    .enum(SKILL_CATEGORIES, {
      errorMap: () => ({ message: 'Please select a valid category' }),
    }),

  allowedTools: z
    .array(z.string().min(1))
    .min(1, 'At least one tool must be specified')
    .max(20, 'Maximum 20 tools allowed'),

  examples: z
    .array(z.string().min(1))
    .min(1, 'At least one example is required')
    .max(10, 'Maximum 10 examples allowed'),

  zipFile: z
    .instanceof(File, { message: 'Please upload a ZIP file' })
    .refine((file) => file.size > 0, 'File cannot be empty')
    .refine((file) => file.size <= 10 * 1024 * 1024, 'File size must be less than 10MB')
    .refine(
      (file) => file.type === 'application/zip' || file.name.endsWith('.zip'),
      'File must be a ZIP archive'
    ),
});

export type SubmitSkillFormValues = z.infer<typeof submitSkillFormSchema>;
