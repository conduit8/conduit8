import { SKILL_CATEGORIES, SkillFrontmatterSchema } from '@conduit8/core';
import { z } from 'zod';

/**
 * Simplified submission form schema
 * User uploads complete ZIP file containing SKILL.md + optional additional files
 * We parse SKILL.md frontmatter and ask user to fill: author, category
 */

/**
 * SKILL.md frontmatter schema (for parsing uploaded ZIP)
 * Re-export from core - already has correct optional fields
 */
export const skillFrontmatterSchema = SkillFrontmatterSchema;

/**
 * Form validation schema
 * Minimal user input: ZIP file + category
 * Backend auto-generates: author (username) + sourceUrl (profile link)
 */
export const submitSkillFormSchema = z.object({
  // User uploads ZIP containing SKILL.md
  zipFile: z
    .instanceof(File)
    .refine(file => file.name.endsWith('.zip'), { message: 'Must be a ZIP file' })
    .refine(file => file.size > 0, { message: 'File cannot be empty' })
    .refine(file => file.size <= 50 * 1024 * 1024, { message: 'ZIP file must be less than 50MB' }),

  // User selects category
  category: z.enum(SKILL_CATEGORIES, {
    message: 'Please select a category',
  }),
});

export type SubmitSkillFormValues = z.infer<typeof submitSkillFormSchema>;
export type SkillFrontmatter = z.infer<typeof skillFrontmatterSchema>;
