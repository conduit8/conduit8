import { z } from 'zod';

import { ALLOWED_FILE_TYPES, MAX_FILE_SIZE_BYTES } from '../constants/media.constants';

// Create tuple of allowed content types from the keys
const _allowedContentTypes = Object.keys(ALLOWED_FILE_TYPES) as [string, ...string[]];

/**
 * Schema for MediaFile entity representation - flattened structure
 */
export const mediaFileDataSchema = z.object({
  id: z.string().uuid(),
  fileName: z
    .string()
    .min(1)
    .regex(/\.[a-z0-9]+$/i, 'Filename must have an extension'),
  fileSize: z
    .number()
    .positive()
    .max(MAX_FILE_SIZE_BYTES, {
      message: `File too large. Maximum size is ${Math.round(MAX_FILE_SIZE_BYTES / (1024 * 1024 * 1024))}GB`,
    }),
  contentType: z
    .string()
    .min(1)
    .refine(type => Object.keys(ALLOWED_FILE_TYPES).includes(type), {
      message: `Invalid file type. Allowed types: ${Object.values(ALLOWED_FILE_TYPES).flat().join(', ')}`,
    }),
  duration: z.number().positive().describe('Duration in seconds for audio/video files'),
  rawKey: z.string(),
  processedKey: z.string().optional(),
  chunks: z.array(z.string()).optional(),
});

export type MediaFileData = z.infer<typeof mediaFileDataSchema>;
