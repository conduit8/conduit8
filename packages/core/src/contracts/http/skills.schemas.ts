import { z } from 'zod';

// GET /api/v1/skills/:slug - Path params
export const GetSkillParamsSchema = z.object({
  slug: z.string().min(1).max(100),
});

// GET /api/v1/skills/:slug - Response
export const GetSkillResponseSchema = z.object({
  success: z.literal(true),
  data: z.object({
    id: z.uuid(),
    slug: z.string(),
    name: z.string(),
    description: z.string(),
    category: z.string().nullish(),
    zipUrl: z.string(),
    examples: z.array(z.string()),
    downloadCount: z.number(),
    author: z.string(),
    authorKind: z.enum(['verified', 'community']),
  }),
});

// POST /api/v1/skills/:slug/downloaded - Path params
export const TrackSkillDownloadParamsSchema = z.object({
  slug: z.string().min(1).max(100),
});

// POST /api/v1/skills/:slug/downloaded - Response
export const TrackSkillDownloadResponseSchema = z.object({
  success: z.literal(true),
});

// Type exports
export type GetSkillParams = z.infer<typeof GetSkillParamsSchema>;
export type GetSkillResponse = z.infer<typeof GetSkillResponseSchema>;
export type TrackSkillDownloadParams = z.infer<typeof TrackSkillDownloadParamsSchema>;
export type TrackSkillDownloadResponse = z.infer<typeof TrackSkillDownloadResponseSchema>;

// Convenience type for Skill data
export type Skill = GetSkillResponse['data'];
