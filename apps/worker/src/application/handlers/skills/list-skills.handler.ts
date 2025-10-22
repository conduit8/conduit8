import type { GetSkillResponse, ListSkillsResponse } from '@conduit8/core';

import type { ListSkills } from '@worker/domain/messages/queries';

import { SkillRepository } from '@worker/infrastructure/persistence/repositories/skill.repository';

type SkillData = GetSkillResponse['data'];

export async function listSkills(
  query: ListSkills,
  env: Cloudflare.Env,
): Promise<ListSkillsResponse['data']> {
  const repo = new SkillRepository(env.D1, env.R2_PUBLIC);

  const skills = await repo.findAll(query.query, query.limit, query.offset);

  return skills.map((skill) => {
    const zipUrl = `${env.R2_PUBLIC_URL}/${skill.zipKey}`;
    const imageUrl = `${env.R2_PUBLIC_URL}/${skill.imageKey}`;
    const videoUrl = `${env.R2_PUBLIC_URL}/videos/${skill.slug}.mp4`;

    return {
      id: skill.id,
      slug: skill.slug,
      name: skill.name,
      description: skill.description,
      category: skill.category as SkillData['category'],
      zipUrl,
      imageUrl,
      videoUrl,
      sourceType: skill.sourceType as SkillData['sourceType'],
      sourceUrl: skill.sourceUrl,
      examples: skill.examples as string[],
      downloadCount: skill.downloadCount,
      author: skill.author,
      authorKind: skill.authorKind as SkillData['authorKind'],
    };
  });
}
