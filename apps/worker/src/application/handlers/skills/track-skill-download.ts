import type { CommandHandler } from '@worker/application/handlers/types';
import type { TrackSkillDownload } from '@worker/domain/messages/commands';

import { SkillNotFoundError } from '@worker/infrastructure/errors/domain.errors';
import { SkillRepository } from '@worker/infrastructure/persistence/repositories/skill.repository';

export const trackSkillDownload: CommandHandler<TrackSkillDownload, void> = async (
  command: TrackSkillDownload,
  env: Env,
) => {
  const repo = new SkillRepository(env.D1);

  // Find skill by slug to get ID
  const skill = await repo.findBySlug(command.slug);

  if (!skill) {
    throw new SkillNotFoundError(command.slug);
  }

  // Increment download count
  await repo.incrementDownloadCount(skill.id);

  console.log(`[TrackSkillDownload] Download tracked for skill: ${command.slug}`);

  return {
    result: undefined,
    events: [],
  };
};
