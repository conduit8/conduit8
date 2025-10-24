import { z } from 'zod';

/**
 * Validation schema for skill submission form
 * User provides SKILL.md content/file, optional additional files, and metadata
 * Frontend will create the ZIP package
 */

// SKILL.md frontmatter validation
export const skillFrontmatterSchema = z.object({
  name: z
    .string()
    .min(3, 'Name must be at least 3 characters')
    .max(100, 'Name must not exceed 100 characters'),
  description: z
    .string()
    .min(20, 'Description must be at least 20 characters')
    .max(500, 'Description must not exceed 500 characters'),
  license: z
    .string()
    .min(1, 'License is required')
    .default('MIT'),
  'allowed-tools': z
    .string()
    .min(1, 'At least one tool must be specified')
    .refine(
      (val) => val.trim().split(/\s+/).length > 0,
      'At least one tool must be specified'
    ),
});

export const submitSkillFormSchema = z.object({
  // SKILL.md content (user can write or upload)
  skillMdContent: z
    .string()
    .min(50, 'SKILL.md content must be at least 50 characters')
    .refine(
      (content) => content.includes('---') && content.split('---').length >= 3,
      'SKILL.md must contain valid YAML frontmatter (enclosed in ---)'
    ),

  // Additional files (scripts, templates, resources)
  additionalFiles: z
    .array(
      z.instanceof(File).refine((file) => file.size <= 5 * 1024 * 1024, 'Each file must be less than 5MB')
    )
    .max(20, 'Maximum 20 additional files allowed')
    .default([]),

  // Metadata fields
  author: z
    .string()
    .min(1, 'Author name is required')
    .max(100, 'Author name must not exceed 100 characters'),

  sourceUrl: z
    .string()
    .url('Must be a valid URL')
    .or(z.literal(''))
    .transform((val) => val || `https://conduit8.com/user-submission`),

  examples: z
    .array(z.string().min(1))
    .min(1, 'At least one example is required')
    .max(10, 'Maximum 10 examples allowed'),
});

export type SubmitSkillFormValues = z.infer<typeof submitSkillFormSchema>;
export type SkillFrontmatter = z.infer<typeof skillFrontmatterSchema>;
