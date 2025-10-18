import { z } from 'zod';

// Raw R2 Event Notification schema - what R2 actually sends
export const r2EventRawSchema = z.object({
  account: z.string(),
  action: z.enum([
    'PutObject',
    'CopyObject',
    'CompleteMultipartUpload',
    'DeleteObject',
    'LifecycleDeletion',
  ]),
  bucket: z.string(),
  object: z.object({
    key: z.string(),
    size: z.number().optional(),
    eTag: z.string().optional(),
  }),
  eventTime: z.string(),
  copySource: z.object({
    bucket: z.string(),
    object: z.string(),
  }).optional(),
});

// Transform R2 events to wrapped message format for consistency
export const r2EventNotificationSchema = r2EventRawSchema.transform(val => ({
  version: 1 as const,
  timestamp: val.eventTime,
  payload: {
    name: `r2:${val.action}` as const, // Add name field for registry lookup
    ...val, // Include all original R2 event data
  },
}));

export type R2EventRaw = z.infer<typeof r2EventRawSchema>;
export type R2UploadCompleteNotification = z.infer<typeof r2EventNotificationSchema>;
