import type { GetSkillResponse } from '@conduit8/core';

import type { GetSkill } from '@worker/domain/messages/queries';
import type { ISkillRepository } from '@worker/domain/repositories/interfaces';

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

  // Generate R2 public URLs
  const zipUrl = `${env.R2_PUBLIC_URL}/${skill.zipKey}`;
  const imageUrl = `${env.R2_PUBLIC_URL}/${skill.imageKey}`;

  return {
    id: skill.id,
    slug: skill.slug,
    name: skill.name,
    description: skill.description,
    category: skill.category,
    zipUrl,
    imageUrl,
    // TODO: Remove type assertions - create shared enum constants in core package
    sourceType: skill.sourceType as 'import' | 'pr' | 'submission',
    sourceUrl: skill.sourceUrl,
    examples: skill.examples as string[],
    downloadCount,
    author: skill.author,
    authorKind: skill.authorKind as 'verified' | 'community',
  };
}
