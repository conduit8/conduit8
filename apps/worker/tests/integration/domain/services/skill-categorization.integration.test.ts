import { env } from 'cloudflare:test';
import { describe, expect, it } from 'vitest';

import { SkillCategorizationService } from '@worker/domain/services';

describe('skillCategorizationService', () => {
  it('should categorize development skill correctly', async () => {
    const service = new SkillCategorizationService(env.AI);

    const category = await service.categorize(
      'A skill for building REST APIs with FastAPI and Python. Includes database integration and authentication.',
    );

    expect(category).toBe('development');
  });

  it('should categorize design skill correctly', async () => {
    const service = new SkillCategorizationService(env.AI);

    const category = await service.categorize(
      'Create beautiful posters, logos, and brand identity designs. Generate color palettes and mockups for client presentations.',
    );

    expect(category).toBe('design');
  });
});
