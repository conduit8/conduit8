import { useState } from 'react';

import { Button } from '@web/ui/components/atoms/buttons/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@web/ui/components/overlays/dialog';

type ReviewMode = 'approve' | 'reject';

interface SkillReviewActionDialogProps {
  mode: ReviewMode;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (value: string | undefined) => void;
  isLoading?: boolean;
  skillName: string;
}

const CONFIG = {
  approve: {
    title: 'Approve Skill',
    description: (skillName: string) => (
      <>
        Are you sure you want to approve
        {' '}
        <strong>{skillName}</strong>
        ? This will publish the skill to the marketplace.
      </>
    ),
    label: 'Curator Note (optional)',
    placeholder: 'Add a note about this skill...',
    buttonText: 'Approve',
    loadingText: 'Approving...',
    buttonVariant: 'default' as const,
    required: false,
  },
  reject: {
    title: 'Reject Skill',
    description: (skillName: string) => (
      <>
        Please provide a reason for rejecting
        {' '}
        <strong>{skillName}</strong>
        . This will be shared with the submitter.
      </>
    ),
    label: 'Rejection Reason',
    placeholder: 'Explain why this skill cannot be approved...',
    buttonText: 'Reject',
    loadingText: 'Rejecting...',
    buttonVariant: 'destructive' as const,
    required: true,
  },
} as const;

export function SkillReviewActionDialog({
  mode,
  open,
  onOpenChange,
  onConfirm,
  isLoading = false,
  skillName,
}: SkillReviewActionDialogProps) {
  const [value, setValue] = useState('');
  const config = CONFIG[mode];

  const handleConfirm = () => {
    const trimmed = value.trim();
    if (config.required && !trimmed)
      return;

    onConfirm(trimmed || undefined);
    setValue('');
  };

  const handleCancel = () => {
    onOpenChange(false);
    setValue('');
  };

  const isConfirmDisabled = isLoading || (config.required && !value.trim());

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{config.title}</DialogTitle>
          <DialogDescription>
            {config.description(skillName)}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="review-input" className="text-sm font-medium">
              {config.label}
              {config.required && <span className="text-destructive"> *</span>}
            </label>
            <textarea
              id="review-input"
              value={value}
              onChange={e => setValue(e.target.value)}
              placeholder={config.placeholder}
              className="min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              disabled={isLoading}
              required={config.required}
            />
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={handleCancel}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button
            variant={config.buttonVariant}
            onClick={handleConfirm}
            disabled={isConfirmDisabled}
          >
            {isLoading ? config.loadingText : config.buttonText}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
