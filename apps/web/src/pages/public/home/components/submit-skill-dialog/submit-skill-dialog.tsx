import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@web/ui/components/overlays/dialog';

import { useSubmitSkill } from '../../hooks/use-submit-skill';
import { SubmitSkillForm } from './submit-skill-form';

import type { SubmitSkillFormValues } from './submit-skill-form.schema';

interface SubmitSkillDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

/**
 * Dialog for submitting a new skill
 * Handles form submission and API communication
 */
export function SubmitSkillDialog({ open, onOpenChange }: SubmitSkillDialogProps) {
  const submitSkillMutation = useSubmitSkill();

  const handleSubmit = async (values: SubmitSkillFormValues) => {
    try {
      await submitSkillMutation.mutateAsync({
        displayName: values.displayName,
        description: values.description,
        category: values.category,
        allowedTools: values.allowedTools,
        examples: values.examples,
        zipFile: values.zipFile,
      });

      // Close dialog on success
      onOpenChange(false);
    }
    catch (error) {
      // Error is handled by the mutation hook (toast notification)
      console.error('Failed to submit skill:', error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        variant="responsive"
        className="sm:max-w-2xl"
      >
        <DialogHeader>
          <DialogTitle>Submit a Skill</DialogTitle>
          <DialogDescription>
            Share your skill with the community. Fill out the form below to submit your skill for review.
          </DialogDescription>
        </DialogHeader>

        <div className="max-h-[60vh] overflow-y-auto px-1">
          <SubmitSkillForm
            onSubmit={handleSubmit}
            isLoading={submitSkillMutation.isPending}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
