import { getApiRoute } from '@conduit8/core';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@web/lib/clients';
import { useState } from 'react';
import { toast } from 'sonner';

interface DeleteDialogState {
  isOpen: boolean;
  slug: string;
  name: string;
}

export function useDeleteSkill() {
  const queryClient = useQueryClient();

  const [dialogState, setDialogState] = useState<DeleteDialogState>({
    isOpen: false,
    slug: '',
    name: '',
  });

  const mutation = useMutation({
    mutationFn: async (slug: string) => {
      const route = getApiRoute('admin_skill_delete').replace(':slug', slug);
      await api.delete(route);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['skills'] });
      toast.success('Skill deleted successfully');
      setDialogState({ isOpen: false, slug: '', name: '' });
    },
    onError: () => {
      toast.error('Failed to delete skill');
    },
  });

  const openDialog = (slug: string, name: string) => {
    setDialogState({ isOpen: true, slug, name });
  };

  const closeDialog = () => {
    setDialogState({ isOpen: false, slug: '', name: '' });
  };

  const confirmDelete = () => {
    mutation.mutate(dialogState.slug);
  };

  return {
    dialogState,
    isDeleting: mutation.isPending,
    openDialog,
    closeDialog,
    confirmDelete,
  };
}
