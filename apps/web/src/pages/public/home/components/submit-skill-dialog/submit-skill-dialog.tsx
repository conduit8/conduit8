import { trackSkillSubmissionDialogOpened } from '@web/lib/analytics';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

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
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (open) {
      trackSkillSubmissionDialogOpened();
    }
  }, [open]);

  const handleSubmit = async (values: SubmitSkillFormValues) => {
    setIsSubmitting(true);

    try {
      const { skillsApi } = await import('../../services/skills-api');
      const result = await skillsApi.submitSkill({
        zipFile: values.zipFile,
        category: values.category,
      });

      toast.success('Skill submitted successfully', {
        description: 'After review, it will be published to the directory',
      });
      onOpenChange(false);
    }
    catch (error) {
      toast.error('Failed to submit skill');
      console.error('Submission error:', error);
    }
    finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    onOpenChange(false);
  };

  const handleOpenChange = (open: boolean) => {
    if (isSubmitting)
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
          isSubmitting={isSubmitting}
        />
      </DialogContent>
    </Dialog>
  );
}
