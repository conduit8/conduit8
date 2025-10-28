import type { ListAdminSubmissionsResponseSchema, ListSubmissionsResponseSchema, SkillAuthorKind, SkillCategory, SkillSourceType, SubmissionStatus } from '@conduit8/core';
import type { z } from 'zod';

import { formatRelativeDate } from '@web/lib/utils/date-utils';
import { SKILL_CATEGORY_ICONS, SKILL_CATEGORY_LABELS } from '@web/pages/shared/models/skill-categories';
import { SKILL_AUTHOR_KIND_LABELS, SKILL_SOURCE_TYPE_LABELS } from '@web/pages/shared/models/skill-metadata';
import { SKILL_STATUS_COLORS, SKILL_STATUS_LABELS } from '@web/pages/shared/models/skill-status';

// Extract submission item type from list response schema
type AdminSubmissionItem = z.infer<typeof ListAdminSubmissionsResponseSchema>['data'][number];
type UserSubmissionItem = z.infer<typeof ListSubmissionsResponseSchema>['data'][number];
type SubmissionResponse = AdminSubmissionItem | UserSubmissionItem;

/**
 * Frontend domain model for skill submissions
 * Aligned with backend SkillSubmission aggregate
 *
 * Provides:
 * - Computed display properties (formatted dates, labels, icons)
 * - Business logic methods (status checks, editability)
 * - Type-safe field access
 * - Centralized display logic (no mapping in components)
 */
export class SkillSubmission {
  constructor(
    public readonly id: string,
    public readonly slug: string,
    public name: string,
    public description: string,
    public category: SkillCategory,
    public author: string, // Display name (happy-monkey-42 or curated by admin)
    public authorKind: SkillAuthorKind,
    public sourceType: SkillSourceType,
    public sourceUrl: string | null,
    public readonly submittedBy: string, // User ID who submitted
    public readonly status: SubmissionStatus,
    public readonly submittedAt: Date,
    public readonly reviewedAt: Date | null,
    public readonly rejectionReason: string | null,
  ) { }

  // === Computed Display Properties ===

  /**
   * Formatted submission date (e.g., "2 hours ago", "3 days ago")
   */
  get formattedSubmittedDate(): string {
    return formatRelativeDate(this.submittedAt);
  }

  /**
   * Human-readable category label
   */
  get categoryLabel(): string {
    return SKILL_CATEGORY_LABELS[this.category];
  }

  /**
   * Category icon component
   */
  get categoryIcon() {
    return SKILL_CATEGORY_ICONS[this.category];
  }

  /**
   * Human-readable author kind label
   */
  get authorKindLabel(): string {
    return SKILL_AUTHOR_KIND_LABELS[this.authorKind];
  }

  /**
   * Human-readable source type label
   */
  get sourceTypeLabel(): string {
    return SKILL_SOURCE_TYPE_LABELS[this.sourceType];
  }

  /**
   * Human-readable status label
   */
  get statusLabel(): string {
    return SKILL_STATUS_LABELS[this.status];
  }

  /**
   * Badge color variant for status
   */
  get statusColor() {
    return SKILL_STATUS_COLORS[this.status];
  }

  // === Business Logic Methods ===

  /**
   * Check if submission is pending review
   */
  isPending(): boolean {
    return this.status === 'pending_review';
  }

  /**
   * Check if submission is rejected
   */
  isRejected(): boolean {
    return this.status === 'rejected';
  }

  /**
   * Check if submission is approved
   */
  isApproved(): boolean {
    return this.status === 'approved';
  }

  /**
   * Check if submission can be edited
   * Editable if: admin view + pending status
   */
  isEditable(isAdmin: boolean): boolean {
    return isAdmin && this.isPending();
  }

  /**
   * Check if rejection reason should be shown
   */
  shouldShowRejectionReason(): boolean {
    return this.isRejected() && this.rejectionReason !== null;
  }

  // === Factory Methods ===

  /**
   * Create domain model from API response
   * Uses SubmissionSchema type from @conduit8/core
   */
  static fromApiResponse(data: SubmissionResponse): SkillSubmission {
    return new SkillSubmission(
      data.id,
      data.slug,
      data.name,
      data.description,
      data.category,
      data.author,
      data.authorKind,
      data.sourceType,
      data.sourceUrl,
      data.submittedBy,
      data.status,
      data.submittedAt,
      data.reviewedAt,
      data.rejectionReason,
    );
  }
}
