/**
 * Skill review status
 */
export const SKILL_STATUS = {
  PENDING: 'pending',
  APPROVED: 'approved',
  REJECTED: 'rejected',
} as const;

export type SkillStatus = typeof SKILL_STATUS[keyof typeof SKILL_STATUS];

export const SKILL_STATUS_LABELS: Record<SkillStatus, string> = {
  pending: 'Pending Review',
  approved: 'Approved',
  rejected: 'Rejected',
};

export const SKILL_STATUS_COLORS: Record<SkillStatus, string> = {
  pending: 'warning',
  approved: 'success',
  rejected: 'destructive',
};
