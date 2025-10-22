import { z } from 'zod';

import { baseCommandSchema } from './base.messages';

// IngestSkill command schema
export const ingestSkillSchema = baseCommandSchema.extend({
  name: z.literal('IngestSkill'),
  fileKey: z.string(),
});

export type IngestSkillMessage = z.infer<typeof ingestSkillSchema>;

// TrackSkillDownload command schema
export const trackSkillDownloadSchema = baseCommandSchema.extend({
  name: z.literal('TrackSkillDownload'),
  slug: z.string(),
});

export type TrackSkillDownloadMessage = z.infer<typeof trackSkillDownloadSchema>;
