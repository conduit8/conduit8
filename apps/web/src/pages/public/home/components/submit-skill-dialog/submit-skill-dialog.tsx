import { trackSkillSubmissionDialogOpened } from '@web/lib/analytics';
import { useEffect } from 'react';

import { useSubmitSkill } from '@web/pages/public/home/hooks/use-submit-skill';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@web/ui/components/overlays/dialog';

import type { SubmitSkillFormValues } from './submit-skill-form.schema';

import { SubmitSkillForm } from './submit-skill-form';

interface SubmitSkillDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

/**
 * Dialog for submitting a new skill
 * User uploads ZIP file and selects category
 * Backend auto-generates author username and profile link
 */
export function SubmitSkillDialog({ open, onOpenChange }: SubmitSkillDialogProps) {
  const { mutate: submitSkill, isPending } = useSubmitSkill();

  useEffect(() => {
    if (open) {
      trackSkillSubmissionDialogOpened();
    }
  }, [open]);

  const handleSubmit = (values: SubmitSkillFormValues) => {
    submitSkill(
      {
        zipFile: values.zipFile,
        category: values.category,
      },
      {
        onSuccess: () => {
          onOpenChange(false);
        },
      },
    );
  };

  const handleCancel = () => {
    onOpenChange(false);
  };

  const handleOpenChange = (open: boolean) => {
    if (isPending)
      return;
    onOpenChange(open);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent variant="responsive" className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Submit a Skill</DialogTitle>
          <DialogDescription>
            Upload your skill as a ZIP file.
            After review, it will be published to the directory.
          </DialogDescription>
        </DialogHeader>

        <SubmitSkillForm
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          isSubmitting={isPending}
        />
      </DialogContent>
    </Dialog>
  );
}
