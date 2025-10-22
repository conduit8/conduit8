import type { GetSkillResponse } from '@conduit8/core';

import type { GetSkill } from '@worker/domain/messages/queries';
import type { ISkillRepository } from '@worker/domain/repositories/interfaces';

import { SkillNotFoundError } from '@worker/infrastructure/errors/domain.errors';
import { SkillRepository } from '@worker/infrastructure/persistence/repositories/skill.repository';

export async function getSkill(
  query: GetSkill,
  env: Cloudflare.Env,
): Promise<GetSkillResponse['data']> {
  const repo: ISkillRepository = new SkillRepository(env.D1, env.R2_PUBLIC);

  const skill = await repo.findBySlug(query.slug);

  if (!skill) {
    throw new SkillNotFoundError(query.slug);
  }

  const downloadCount = await repo.getDownloadCount(skill.id);

  // Check if video exists in R2
  const hasVideo = await repo.videoExists(skill.slug);

  // Generate R2 public URLs
  const zipUrl = `${env.R2_PUBLIC_URL}/${skill.zipKey}`;
  const imageUrl = `${env.R2_PUBLIC_URL}/${skill.imageKey}`;
  const videoUrl = hasVideo ? `${env.R2_PUBLIC_URL}/videos/${skill.slug}.webm` : undefined;

  return {
    id: skill.id,
    slug: skill.slug,
    name: skill.name,
    description: skill.description,
    category: skill.category as GetSkillResponse['data']['category'],
    zipUrl,
    imageUrl,
    videoUrl,
    sourceType: skill.sourceType as GetSkillResponse['data']['sourceType'],
    sourceUrl: skill.sourceUrl,
    examples: skill.examples as string[],
    downloadCount,
    author: skill.author,
    authorKind: skill.authorKind as GetSkillResponse['data']['authorKind'],
  };
}
