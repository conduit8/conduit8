import type { ListSkillsResponse } from '@conduit8/core';

import type { ListSkills } from '@worker/domain/messages/queries';

import { SkillRepository } from '@worker/infrastructure/persistence/repositories/skill.repository';

export async function listSkills(
  query: ListSkills,
  env: Cloudflare.Env,
): Promise<ListSkillsResponse['data']> {
  const repo = new SkillRepository(env.D1);

  const skills = await repo.findAll(query.query, query.limit, query.offset);

  return skills.map((skill) => {
    const zipUrl = `${env.R2_PUBLIC_URL}/${skill.zipKey}`;

    return {
      id: skill.id,
      slug: skill.slug,
      name: skill.name,
      description: skill.description,
      category: skill.category,
      zipUrl,
      examples: skill.examples as string[],
      downloadCount: skill.downloadCount,
      author: skill.author,
      authorKind: skill.authorKind as 'verified' | 'community',
    };
  });
}
