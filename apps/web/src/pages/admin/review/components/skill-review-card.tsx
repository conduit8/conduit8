import type { ListPendingSubmissionsResponse, ListSubmissionsResponse, SubmissionStatus } from '@conduit8/core';

import { SUBMISSION_STATUS } from '@conduit8/core';
import { CheckIcon, XIcon } from '@phosphor-icons/react';
import { useState } from 'react';

import { formatRelativeDate } from '@web/lib/utils/date-utils';
import { SkillReviewActionDialog } from '@web/pages/admin/review/components/skill-review-action-dialog';
import { useApproveSubmission, useRejectSubmission } from '@web/pages/admin/review/hooks/use-review-actions';
import { SKILL_CATEGORY_ICONS, SKILL_CATEGORY_LABELS } from '@web/pages/shared/models/skill-categories';
import { SKILL_STATUS_COLORS, SKILL_STATUS_LABELS } from '@web/pages/shared/models/skill-status';
import { Button } from '@web/ui/components/atoms/buttons/button';
import { Badge } from '@web/ui/components/atoms/indicators/badge';
import { Alert } from '@web/ui/components/feedback/alerts/alert';
import { Card } from '@web/ui/components/layout/containers/card';

// Type for user submissions (no submittedBy field)
type UserSubmission = ListSubmissionsResponse['data'][number];

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
  const [dialogMode, setDialogMode] = useState<'approve' | 'reject' | null>(null);

  const { mutate: approve, isPending: isApproving } = useApproveSubmission();
  const { mutate: reject, isPending: isRejecting } = useRejectSubmission();

  const handleApprove = () => {
    setDialogMode('approve');
  };

  const handleReject = () => {
    setDialogMode('reject');
  };

  const handleDialogConfirm = (value: string | undefined) => {
    if (dialogMode === 'approve') {
      approve(
        { submissionId: skill.id, request: value ? { curatorNote: value } : {} },
        {
          onSuccess: () => {
            setDialogMode(null);
          },
        },
      );
    }
    else if (dialogMode === 'reject' && value) {
      reject(
        { submissionId: skill.id, request: { reason: value } },
        {
          onSuccess: () => {
            setDialogMode(null);
          },
        },
      );
    }
  };

  const showActions = isAdmin && skill.status === SUBMISSION_STATUS.PENDING_REVIEW;
  const showRejectionReason = skill.status === 'rejected' && skill.rejectionReason;
  const isLoading = isApproving || isRejecting;

  return (
    <Card className="p-4">
      <div className="flex flex-col md:flex-row md:gap-6">
        {/* Left Column: Content (70%) */}
        <div className="flex-1 space-y-3">
          {/* Header: Skill Name + Status Badge */}
          <div className="flex items-start justify-between gap-3">
            <h3 className="font-semibold text-lg">{skill.name}</h3>
            <Badge variant={SKILL_STATUS_COLORS[skill.status as SubmissionStatus]}>
              {SKILL_STATUS_LABELS[skill.status as SubmissionStatus]}
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
                <strong>Rejection reason: </strong>
                {skill.rejectionReason}
              </p>
            </Alert>
          )}

          {/* Metadata Row: Category, Submitter (admin only), Date */}
          <div className="flex items-center gap-3 text-sm flex-wrap">
            {/* Category Badge */}
            <Badge variant="neutral">
              {(() => {
                const Icon = SKILL_CATEGORY_ICONS[skill.category];
                return <Icon weight="duotone" />;
              })()}
              {SKILL_CATEGORY_LABELS[skill.category]}
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
              variant="outline"
              className="flex-1 md:w-full"
              disabled={isLoading}
            >
              <CheckIcon weight="bold" />
              {isApproving ? 'Approving...' : 'Approve'}
            </Button>
            <Button
              onClick={handleReject}
              variant="destructive"
              className="flex-1 md:w-full"
              disabled={isLoading}
            >
              <XIcon weight="bold" />
              {isRejecting ? 'Rejecting...' : 'Reject'}
            </Button>
          </div>
        )}
      </div>

      {/* Unified Dialog */}
      {dialogMode && (
        <SkillReviewActionDialog
          mode={dialogMode}
          open={true}
          onOpenChange={open => !open && setDialogMode(null)}
          onConfirm={handleDialogConfirm}
          isLoading={isLoading}
          skillName={skill.name}
        />
      )}
    </Card>
  );
}
