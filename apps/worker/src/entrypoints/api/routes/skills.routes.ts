import {
  APP_ROUTES,
  GetSkillParamsSchema,
  ListSkillsQuerySchema,
  TrackSkillDownloadParamsSchema,
} from '@conduit8/core';
import { zValidator } from '@hono/zod-validator';
import { getSkill, listSkills, trackSkillDownload } from '@worker/application/handlers/skills';
import { Hono } from 'hono';
import { HTTPException } from 'hono/http-exception';

import type { AppContext } from '@worker/entrypoints/api/types/context';

import { TrackSkillDownload } from '@worker/domain/messages/commands';
import { GetSkill, ListSkills } from '@worker/domain/messages/queries';
import { SkillNotFoundError } from '@worker/infrastructure/errors/domain.errors';

const skills = new Hono<AppContext>().basePath(APP_ROUTES.api.prefix);

// GET /api/v1/skills
skills.get(APP_ROUTES.api.paths.skills, zValidator('query', ListSkillsQuerySchema), async (c) => {
  const query = c.req.valid('query');

  const listSkillsQuery = new ListSkills(query.q, query.limit, query.offset);
  const skillsList = await listSkills(listSkillsQuery, c.env);

  return c.json({
    success: true,
    data: skillsList,
  });
});

// GET /api/v1/skills/:slug
skills.get(APP_ROUTES.api.paths.skill_by_slug, zValidator('param', GetSkillParamsSchema), async (c) => {
  const { slug } = c.req.valid('param');

  try {
    const getSkillQuery = new GetSkill(slug);
    const skill = await getSkill(getSkillQuery, c.env);

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
