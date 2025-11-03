import { Button } from '@web/ui/components/atoms/buttons';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@web/ui/components/overlays/dialog';

interface DeleteSkillDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  skillName: string;
  onConfirm: () => void;
  isDeleting?: boolean;
}

export function DeleteSkillDialog({
  open,
  onOpenChange,
  skillName,
  onConfirm,
  isDeleting = false,
}: DeleteSkillDialogProps) {
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
            disabled={isDeleting}
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={onConfirm}
            disabled={isDeleting}
          >
            {isDeleting ? 'Deleting...' : 'Delete'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
