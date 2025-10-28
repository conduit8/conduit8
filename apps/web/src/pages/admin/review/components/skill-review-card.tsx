import { SKILL_AUTHOR_KINDS, SKILL_SOURCE_TYPES } from '@conduit8/core';
import { CheckIcon, XIcon } from '@phosphor-icons/react';
import { useState } from 'react';

import type { SkillSubmission } from '@web/pages/shared/models/skill-submission';

import { EditableCategoryBadge } from '@web/pages/admin/review/components/editable-category-badge';
import { EditableSelect, EditableTextField } from '@web/pages/admin/review/components/editable-field';
import { SkillReviewActionDialog } from '@web/pages/admin/review/components/skill-review-action-dialog';
import { useApproveSubmission, useRejectSubmission } from '@web/pages/admin/review/hooks/use-review-actions';
import { useUpdateSubmission } from '@web/pages/admin/review/hooks/use-update-submission';
import { SKILL_AUTHOR_KIND_LABELS, SKILL_SOURCE_TYPE_LABELS } from '@web/pages/shared/models/skill-metadata';
import { Button } from '@web/ui/components/atoms/buttons/button';
import { Badge } from '@web/ui/components/atoms/indicators/badge';
import { Alert } from '@web/ui/components/feedback/alerts/alert';
import { Card } from '@web/ui/components/layout/containers/card';

interface SkillReviewCardProps {
  skill: SkillSubmission;
  isAdmin?: boolean;
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
  const isEditable = skill.isEditable(isAdmin);
  const [dialogMode, setDialogMode] = useState<'approve' | 'reject' | null>(null);

  const { mutate: approve, isPending: isApproving } = useApproveSubmission();
  const { mutate: reject, isPending: isRejecting } = useRejectSubmission();
  const {
    mutate: updateSubmission,
    isPending: isUpdating,
  } = useUpdateSubmission(skill.id, skill.status);

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

  const showActions = skill.isPending() && isAdmin;
  const isLoading = isApproving || isRejecting;

  // Options for editable selects
  const authorKindOptions = SKILL_AUTHOR_KINDS.map(kind => ({
    value: kind,
    label: SKILL_AUTHOR_KIND_LABELS[kind],
  }));

  const sourceTypeOptions = SKILL_SOURCE_TYPES.map(type => ({
    value: type,
    label: SKILL_SOURCE_TYPE_LABELS[type],
  }));

  return (
    <Card className="relative p-4">

      <div className="flex flex-col md:flex-row md:gap-6">
        {/* Left Column: Content (70%) */}
        <div className="flex-1 space-y-3">
          {/* Header: Skill Name + Status Badge */}
          <div className="flex items-start justify-between gap-3">
            {isEditable
              ? (
                  <EditableTextField
                    value={skill.name}
                    onSave={name => updateSubmission({ name })}
                    isPending={isUpdating}
                    className="font-semibold text-lg"
                  />
                )
              : <h3 className="font-semibold text-lg">{skill.name}</h3>}
            <Badge variant={skill.statusColor}>
              {skill.statusLabel}
            </Badge>
          </div>

          {/* Submission Date (muted) */}
          <span className="text-sm text-muted-foreground">
            {skill.formattedSubmittedDate}
          </span>

          {/* Description */}
          <p className="text-sm text-muted-foreground line-clamp-3">
            {skill.description}
          </p>

          {/* Rejection Reason Alert (if rejected) */}
          {skill.shouldShowRejectionReason() && (
            <Alert variant="destructive">
              <p className="text-sm">
                <strong>Rejection reason: </strong>
                {skill.rejectionReason}
              </p>
            </Alert>
          )}

          {/* Metadata Row: Category, Author, Kind, Source */}
          <div className="flex items-center gap-2 text-sm flex-wrap">
            {/* Category Badge */}
            {isEditable
              ? (
                  <EditableCategoryBadge
                    submissionId={skill.id}
                    currentCategory={skill.category}
                    currentStatus={skill.status}
                  />
                )
              : (
                  <Badge variant="neutral">
                    {(() => {
                      const Icon = skill.categoryIcon;
                      return <Icon weight="duotone" />;
                    })()}
                    {skill.categoryLabel}
                  </Badge>
                )}

            <span className="text-muted-foreground">•</span>

            {/* Author */}
            {isEditable
              ? (
                  <EditableTextField
                    value={skill.author}
                    onSave={author => updateSubmission({ author })}
                    isPending={isUpdating}
                    className="text-muted-foreground"
                  />
                )
              : <span className="text-muted-foreground">{skill.author}</span>}

            <span className="text-muted-foreground">•</span>

            {/* Author Kind */}
            {isEditable
              ? (
                  <EditableSelect
                    value={skill.authorKind}
                    options={authorKindOptions}
                    onSave={authorKind => updateSubmission({ authorKind: authorKind as 'verified' | 'community' })}
                    isPending={isUpdating}
                    className="text-muted-foreground"
                  />
                )
              : <span className="text-muted-foreground">{skill.authorKindLabel}</span>}

            <span className="text-muted-foreground">•</span>

            {/* Source Type */}
            {isEditable
              ? (
                  <EditableSelect
                    value={skill.sourceType}
                    options={sourceTypeOptions}
                    onSave={sourceType => updateSubmission({ sourceType: sourceType as 'import' | 'pr' | 'submission' })}
                    isPending={isUpdating}
                    className="text-muted-foreground"
                  />
                )
              : <span className="text-muted-foreground">{skill.sourceTypeLabel}</span>}
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
