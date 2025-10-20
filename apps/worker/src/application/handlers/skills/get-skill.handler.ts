import type { GetSkillResponse } from '@conduit8/core';

import type { GetSkill } from '@worker/domain/messages/queries';
import type { ISkillRepository } from '@worker/infrastructure/persistence/skill.repository.interface';

import { SkillNotFoundError } from '@worker/infrastructure/errors/domain.errors';
import { SkillRepository } from '@worker/infrastructure/persistence/repositories/skill.repository';

export async function getSkill(
  query: GetSkill,
  env: Cloudflare.Env,
): Promise<GetSkillResponse['data']> {
  const repo: ISkillRepository = new SkillRepository(env.D1);

  const skill = await repo.findBySlug(query.slug);

  if (!skill) {
    throw new SkillNotFoundError(query.slug);
  }

  const downloadCount = await repo.getDownloadCount(skill.id);

  // Generate R2 public URL
  const zipUrl = `${env.R2_PUBLIC_URL}/${skill.zipKey}`;

  return {
    id: skill.id,
    slug: skill.slug,
    name: skill.name,
    description: skill.description,
    category: skill.category,
    zipUrl,
    examples: skill.examples as string[],
    downloadCount,
    author: skill.author,
    authorKind: skill.authorKind as 'verified' | 'community',
  };
}
