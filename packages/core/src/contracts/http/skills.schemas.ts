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

// GET /api/v1/skills - Query params
export const ListSkillsQuerySchema = z.object({
  q: z.string().optional(),
  limit: z.coerce.number().min(1).max(100).default(50),
  offset: z.coerce.number().min(0).default(0),
});

// GET /api/v1/skills - Response
export const ListSkillsResponseSchema = z.object({
  success: z.literal(true),
  data: z.array(GetSkillResponseSchema.shape.data),
});

// Type exports
export type GetSkillParams = z.infer<typeof GetSkillParamsSchema>;
export type GetSkillResponse = z.infer<typeof GetSkillResponseSchema>;
export type TrackSkillDownloadParams = z.infer<typeof TrackSkillDownloadParamsSchema>;
export type TrackSkillDownloadResponse = z.infer<typeof TrackSkillDownloadResponseSchema>;
export type ListSkillsQuery = z.infer<typeof ListSkillsQuerySchema>;
export type ListSkillsResponse = z.infer<typeof ListSkillsResponseSchema>;

// Convenience type for Skill data
export type Skill = GetSkillResponse['data'];
