import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@web/ui/components/overlays/dialog';
import { toast } from 'sonner';

import { useSubmitSkill } from '../../hooks/use-submit-skill';
import { SubmitSkillFormV2 } from './submit-skill-form.v2';
import { createSkillZip } from '../../utils/create-skill-zip';

import type { SubmitSkillFormValues } from './submit-skill-form.schema.v2';

interface SubmitSkillDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  userEmail?: string;
}

/**
 * Dialog for submitting a new skill
 * User provides SKILL.md content, optional files, and metadata
 * Frontend creates ZIP package and uploads to backend
 */
export function SubmitSkillDialogV2({ open, onOpenChange, userEmail }: SubmitSkillDialogProps) {
  const submitSkillMutation = useSubmitSkill();

  const handleSubmit = async (values: SubmitSkillFormValues) => {
    try {
      // 1. Create ZIP package client-side
      toast.info('Creating skill package...');

      const skillZipBlob = await createSkillZip(
        values.skillMdContent,
        values.additionalFiles,
        {
          author: values.author,
          authorKind: 'community', // User submissions are always community
          sourceType: 'submission',
          sourceUrl: values.sourceUrl || 'https://conduit8.com/user-submission',
          examples: values.examples,
          curatorNote: null,
        }
      );

      // 2. Convert Blob to File for upload
      const skillZipFile = new File([skillZipBlob], 'skill.zip', {
        type: 'application/zip',
      });

      // 3. Submit to backend
      await submitSkillMutation.mutateAsync({
        zipFile: skillZipFile,
      });

      // 4. Close dialog on success
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
        className="sm:max-w-3xl"
      >
        <DialogHeader>
          <DialogTitle>Submit a Skill</DialogTitle>
          <DialogDescription>
            Share your skill with the community. Provide your SKILL.md content, optional supporting files, and metadata.
          </DialogDescription>
        </DialogHeader>

        <div className="max-h-[65vh] overflow-y-auto px-1">
          <SubmitSkillFormV2
            onSubmit={handleSubmit}
            isLoading={submitSkillMutation.isPending}
            defaultAuthor={userEmail || ''}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
