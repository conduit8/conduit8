import { Button } from '@web/ui/components/atoms/buttons';
import { useState } from 'react';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@web/ui/components/overlays/dialog';

import { useDeleteSkill } from '../hooks/use-delete-skill';

interface DeleteDialogState {
  isOpen: boolean;
  slug: string;
  name: string;
}

/**
 * Hook to manage delete skill dialog state
 * Stores the skill being deleted (slug + name) for dialog display
 */
export function useDeleteSkillDialog() {
  const [state, setState] = useState<DeleteDialogState>({
    isOpen: false,
    slug: '',
    name: '',
  });

  return {
    isOpen: state.isOpen,
    skillSlug: state.slug,
    skillName: state.name,
    open: (slug: string, name: string) => setState({ isOpen: true, slug, name }),
    close: () => setState({ isOpen: false, slug: '', name: '' }),
  };
}

interface DeleteSkillDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  skillSlug: string;
  skillName: string;
}

export function DeleteSkillDialog({
  open,
  onOpenChange,
  skillSlug,
  skillName,
}: DeleteSkillDialogProps) {
  const { mutate: deleteSkill, isPending } = useDeleteSkill();

  const handleConfirm = () => {
    deleteSkill(skillSlug, {
      onSuccess: () => onOpenChange(false),
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="component-width-card">
        <DialogHeader>
          <DialogTitle>Delete skill?</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete
            {' '}
            <strong>{skillName}</strong>
            ? This action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="gap-2">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isPending}
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={handleConfirm}
            disabled={isPending}
          >
            {isPending ? 'Deleting...' : 'Delete'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
