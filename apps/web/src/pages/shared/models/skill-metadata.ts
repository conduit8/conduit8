import type { SkillAuthorKind, SkillSourceType } from '@conduit8/core';

/**
 * Human-readable labels for skill metadata fields
 * Shared across domain models and UI components
 */

export const SKILL_AUTHOR_KIND_LABELS: Record<SkillAuthorKind, string> = {
  verified: 'Verified',
  community: 'Community',
};

export const SKILL_SOURCE_TYPE_LABELS: Record<SkillSourceType, string> = {
  import: 'Import',
  pr: 'Pull Request',
  submission: 'Submission',
};
