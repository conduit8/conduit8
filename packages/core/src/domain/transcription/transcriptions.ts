import { z } from 'zod';

import { whisperLanguageSchema } from './models-config';

// Validation schema
export const transcriptionSettingsSchema = z.object({
  provider: z.enum(['groq', 'elevenlabs']),
  model: z.enum(['whisper-large-v3-turbo', 'whisper-large-v3', 'scribe-v1']),
  responseFormat: z.enum(['json', 'verbose_json', 'text']),
  timestampGranularities: z.array(z.enum(['segment', 'word'])).min(1),
  temperature: z.number().min(0).max(1).default(0),
  language: whisperLanguageSchema,
  prompt: z.string().optional(),
  translateToEn: z.boolean().default(false),
})
  .refine(
    (data) => {
    // If English is selected, translateToEn must be false
      if (data.language === 'en') {
        return data.translateToEn === false;
      }
      // For other languages, allow any boolean value
      return true;
    },
    {
      message: 'Cannot translate English to English',
      path: ['translateToEn'],
    },
  );

// Derive types from schema
export type TranscriptionSettings = z.infer<typeof transcriptionSettingsSchema>;

export const TranscriptionJobStatusSchema = z.enum([
  'pending',
  'processing',
  'transcribing',
  'completed',
  'failed',
  'deleted',
]);

export type TranscriptionJobStatus = z.infer<typeof TranscriptionJobStatusSchema>;
