import type { SkillCategory } from '@conduit8/core';

import { SKILL_CATEGORIES } from '@conduit8/core';
import { z } from 'zod';

/**
 * Response schema for AI categorization
 */
const CategorizationResponseSchema = z.object({
  category: z.enum(SKILL_CATEGORIES),
  reasoning: z.string().optional(),
});

/**
 * Domain service for categorizing skills using AI
 */
export class SkillCategorizationService {
  constructor(private ai: Ai) { }

  async categorize(description: string): Promise<SkillCategory> {
    const categoryList = SKILL_CATEGORIES.map((cat, i) => `${i + 1}. ${cat}`).join('\n');

    try {
      const response = await this.ai.run('@cf/meta/llama-3-8b-instruct', {
        messages: [
          {
            role: 'system',
            content: `You are a skill categorization assistant. Categorize skills into exactly ONE category based on their description.

Categories:
${categoryList}

Return JSON with the category name.`,
          },
          {
            role: 'user',
            content: `Categorize this skill: "${description}"`,
          },
        ],
        response_format: {
          type: 'json_schema',
          json_schema: {
            type: 'object',
            properties: {
              category: {
                type: 'string',
                enum: SKILL_CATEGORIES as unknown as string[],
              },
              reasoning: {
                type: 'string',
              },
            },
            required: ['category'],
          },
        },
      } as any);

      // Parse response - AI returns { response: { category, reasoning } }
      const parsedJson = (response as any).response;

      // Validate AI response
      const parsed = CategorizationResponseSchema.safeParse(parsedJson);
      if (!parsed.success) {
        console.error('[SkillCategorization] AI returned invalid category', {
          response,
          parsedJson,
          zodError: parsed.error,
        });
        return 'development'; // Fallback
      }

      return parsed.data.category;
    }
    catch (error) {
      console.error('[SkillCategorization] AI categorization failed', { description, error });
      return 'development'; // Fallback
    }
  }
}
