import type { ListMySubmissionsResponse, ListPendingSubmissionsResponse } from '@conduit8/core';

import { formatRelativeDate } from '@web/lib/utils/date-utils';
import { SKILL_STATUS_COLORS, SKILL_STATUS_LABELS } from '@web/lib/types/skill-status';
import { Alert } from '@web/ui/components/feedback/alerts/alert';
import { Badge } from '@web/ui/components/atoms/indicators/badge';
import { Button } from '@web/ui/components/atoms/buttons/button';
import { Card } from '@web/ui/components/layout/containers/card';

// Type for user submissions (no submittedBy field)
type UserSubmission = ListMySubmissionsResponse['data'][number];

// Type for admin submissions (includes submittedBy field)
type AdminSubmission = ListPendingSubmissionsResponse['data'][number];

interface SkillReviewCardProps {
  skill: UserSubmission | AdminSubmission;
  isAdmin?: boolean;
}

/**
 * Check if submission includes submittedBy (admin view)
 */
function isAdminSubmission(skill: UserSubmission | AdminSubmission): skill is AdminSubmission {
  return 'submittedBy' in skill;
}

/**
 * Skill review card component
 *
 * Two-column layout (70/30) for admins:
 * - Left: Name, description, metadata (category, submitter, date)
 * - Right: Admin actions (approve/reject buttons)
 *
 * Full-width layout for users:
 * - Shows submission details with status badge
 */
export function SkillReviewCard({
  skill,
  isAdmin = false,
}: SkillReviewCardProps) {
  // Placeholder handlers - will wire up to backend in next task
  const handleApprove = () => {
    console.log('Approve submission:', skill.id);
  };

  const handleReject = () => {
    console.log('Reject submission:', skill.id);
  };

  const showActions = isAdmin && skill.status === 'pending_review';
  const showRejectionReason = skill.status === 'rejected' && skill.rejectionReason;

  return (
    <Card className="p-4">
      <div className="flex flex-col md:flex-row md:gap-6">
        {/* Left Column: Content (70%) */}
        <div className="flex-1 space-y-3">
          {/* Header: Skill Name + Status Badge */}
          <div className="flex items-start justify-between gap-3">
            <h3 className="font-semibold text-lg">{skill.name}</h3>
            <Badge variant={SKILL_STATUS_COLORS[skill.status] as any}>
              {SKILL_STATUS_LABELS[skill.status]}
            </Badge>
          </div>

          {/* Description */}
          <p className="text-sm text-muted-foreground line-clamp-3">
            {skill.description}
          </p>

          {/* Rejection Reason Alert (if rejected) */}
          {showRejectionReason && (
            <Alert variant="destructive">
              <p className="text-sm">
                <strong>Rejection reason:</strong>
                {' '}
                {skill.rejectionReason}
              </p>
            </Alert>
          )}

          {/* Metadata Row: Category, Submitter (admin only), Date */}
          <div className="flex items-center gap-3 text-sm flex-wrap">
            {/* Category Badge */}
            <Badge variant="neutral" className="capitalize">
              {skill.category}
            </Badge>

            {/* Submitter Info (admin view only) */}
            {isAdmin && isAdminSubmission(skill) && (
              <>
                <span className="text-muted-foreground">•</span>
                <span className="text-muted-foreground">
                  By:
                  {' '}
                  {skill.submittedBy.name || skill.submittedBy.email}
                </span>
              </>
            )}

            {/* Submission Date */}
            <span className="text-muted-foreground">•</span>
            <span className="text-muted-foreground">
              {formatRelativeDate(skill.submittedAt)}
            </span>
          </div>
        </div>

        {/* Right Column: Admin Actions (30%, admin only, pending only) */}
        {showActions && (
          <div className="flex flex-row md:flex-col gap-2 mt-4 md:mt-0 md:w-[30%] md:min-w-[180px]">
            <Button
              onClick={handleApprove}
              variant="default"
              className="flex-1 md:w-full"
            >
              Approve
            </Button>
            <Button
              onClick={handleReject}
              variant="destructive"
              className="flex-1 md:w-full"
            >
              Reject
            </Button>
          </div>
        )}
      </div>
    </Card>
  );
}
