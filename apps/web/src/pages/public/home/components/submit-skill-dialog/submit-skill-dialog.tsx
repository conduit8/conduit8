import { useState } from 'react';
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

  const handleSubmit = async (values: SubmitSkillFormValues) => {
    setIsSubmitting(true);

    try {
      // TODO: Replace with actual API call
      console.log('Submitting skill:', values);

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));

      toast.success('Skill submitted successfully!');
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
    if (isSubmitting) return;
    onOpenChange(open);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent variant="responsive" className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Submit a Skill</DialogTitle>
          <DialogDescription>
            Upload your skill package ZIP.
            After review, it will be approved and published to the directory.
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
