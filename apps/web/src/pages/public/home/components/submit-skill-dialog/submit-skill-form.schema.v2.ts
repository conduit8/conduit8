import { z } from 'zod';

/**
 * Validation schema for skill submission form
 * User provides SKILL.md content/file, optional additional files, and metadata
 * Frontend will create the ZIP package
 */

/**
 * Allowed file extensions for additional files
 * Generous list to support legitimate use cases while preventing obvious malware
 */
export const ALLOWED_FILE_EXTENSIONS = [
  // Documentation
  '.md', '.txt', '.pdf', '.rst', '.adoc',
  // Code/Scripts (common skill resources)
  '.js', '.jsx', '.ts', '.tsx', '.py', '.sh', '.bash', '.zsh', '.fish',
  '.rb', '.go', '.rs', '.java', '.kt', '.swift', '.c', '.cpp', '.h', '.hpp',
  // Config/Data
  '.json', '.yaml', '.yml', '.toml', '.xml', '.csv', '.env.example',
  // Web
  '.html', '.css', '.scss', '.sass', '.less',
  // Templates
  '.template', '.mustache', '.hbs', '.ejs',
  // Images (for documentation)
  '.png', '.jpg', '.jpeg', '.gif', '.svg', '.webp',
  // Other
  '.sql', '.graphql', '.proto',
] as const;

// No domain restrictions on source URLs - they're just metadata/reference links
// Backend can optionally flag unknown domains for manual review if needed

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
      { message: 'At least one tool must be specified' }
    ),
});

export const submitSkillFormSchema = z.object({
  // SKILL.md content (user can write or upload)
  skillMdContent: z
    .string()
    .min(50, 'SKILL.md content must be at least 50 characters')
    .max(200 * 1024, 'SKILL.md content must be less than 200KB') // Prevent DoS
    .refine(
      (content) => content.includes('---') && content.split('---').length >= 3,
      { message: 'SKILL.md must contain valid YAML frontmatter (enclosed in ---)' }
    ),

  // Additional files (scripts, templates, resources)
  additionalFiles: z
    .array(
      z.instanceof(File)
        .refine((file) => file.size > 0, { message: 'File cannot be empty' })
        .refine((file) => file.size <= 5 * 1024 * 1024, { message: 'Each file must be less than 5MB' })
        .refine(
          (file) => {
            const ext = file.name.toLowerCase().match(/(\.[^.]+)$/)?.[1];
            if (!ext) return false;
            return ALLOWED_FILE_EXTENSIONS.includes(ext as any);
          },
          { message: `File type not allowed. Allowed types: ${ALLOWED_FILE_EXTENSIONS.slice(0, 10).join(', ')}...` }
        )
    )
    .max(20, 'Maximum 20 additional files allowed')
    .default([]),

  // Metadata fields
  author: z
    .string()
    .min(1, 'Author name is required')
    .max(100, 'Author name must not exceed 100 characters')
    .regex(/^[a-zA-Z0-9\s\-_.@]+$/, 'Author name contains invalid characters'),

  sourceUrl: z
    .union([
      z.string().url({ message: 'Must be a valid URL' }),
      z.literal(''),
    ])
    .transform((val) => val || 'https://conduit8.com/user-submission'),

  examples: z
    .array(z.string().min(1).max(200, 'Example too long'))
    .min(1, 'At least one example is required')
    .max(10, 'Maximum 10 examples allowed'),
});

export type SubmitSkillFormValues = z.infer<typeof submitSkillFormSchema>;
export type SkillFrontmatter = z.infer<typeof skillFrontmatterSchema>;
