import { z } from 'zod';

/**
 * Schema for metadata stored in R2 customMetadata
 * Handles the raw R2 format (lowercase fields, string values) and transforms to domain format
 */
export const r2MediafileMetadataSchema = z.object({
  filename: z.string().transform(s => decodeURIComponent(s)),
  contenttype: z.string(),
  filesize: z.string().transform(s => Number(s)),
  duration: z.string().transform(s => Number(s)),
}).transform(data => ({
  fileName: data.filename,
  contentType: data.contenttype,
  fileSize: data.filesize,
  duration: data.duration,
}));
