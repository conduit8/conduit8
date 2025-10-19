import { z } from 'zod';

// GET /api/v1/skills/:id - Path params
export const GetSkillParamsSchema = z.object({
  id: z.uuid(),
});

// GET /api/v1/skills/:id - Response
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

// Type exports
export type GetSkillParams = z.infer<typeof GetSkillParamsSchema>;
export type GetSkillResponse = z.infer<typeof GetSkillResponseSchema>;
