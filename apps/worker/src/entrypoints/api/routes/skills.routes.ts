import { APP_ROUTES, GetSkillParamsSchema, TrackSkillDownloadParamsSchema } from '@conduit8/core';
import { zValidator } from '@hono/zod-validator';
import { Hono } from 'hono';
import { HTTPException } from 'hono/http-exception';

import type { AppContext } from '@worker/entrypoints/api/types/context';

import { trackSkillDownload } from '@worker/application/handlers/skills/track-skill-download';
import { getSkillQuery } from '@worker/application/queries/skills/get-skill.query';
import { TrackSkillDownload } from '@worker/domain/messages/commands';
import { SkillNotFoundError } from '@worker/infrastructure/errors/domain.errors';

const skills = new Hono<AppContext>().basePath(APP_ROUTES.api.prefix);

// GET /api/v1/skills/:slug
skills.get(APP_ROUTES.api.paths.skill_by_slug, zValidator('param', GetSkillParamsSchema), async (c) => {
  const { slug } = c.req.valid('param');

  try {
    const skill = await getSkillQuery(slug, c.env);

    return c.json({
      success: true,
      data: skill,
    });
  }
  catch (error) {
    if (error instanceof SkillNotFoundError) {
      throw new HTTPException(404, { message: error.message });
    }

    throw error;
  }
});

// POST /api/v1/skills/:slug/downloaded
skills.post(
  APP_ROUTES.api.paths.skill_download,
  zValidator('param', TrackSkillDownloadParamsSchema),
  async (c) => {
    const { slug } = c.req.valid('param');

    try {
      const command = new TrackSkillDownload(slug);
      await trackSkillDownload(command, c.env);

      return c.json({ success: true });
    }
    catch (error) {
      if (error instanceof SkillNotFoundError) {
        throw new HTTPException(404, { message: error.message });
      }

      throw error;
    }
  },
);

export default skills;
