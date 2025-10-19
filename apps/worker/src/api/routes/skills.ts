import { zValidator } from '@hono/zod-validator';
import { Hono } from 'hono';

import { GetSkillParamsSchema } from '@conduit8/core/contracts/http/skills.schemas';

import { getSkillQuery } from '@worker/application/queries/skills/get-skill.query';

const skills = new Hono<{ Bindings: Cloudflare.Env }>();

// GET /api/v1/skills/:id
skills.get('/:id', zValidator('param', GetSkillParamsSchema), async (c) => {
  const { id } = c.req.valid('param');

  try {
    const skill = await getSkillQuery(id, c.env);

    return c.json({
      success: true,
      data: skill,
    });
  }
  catch (error) {
    if (error instanceof Error && error.message === 'Skill not found') {
      return c.json(
        {
          success: false,
          error: 'Skill not found',
        },
        404,
      );
    }

    throw error;
  }
});

export { skills };
