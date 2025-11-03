import { getApiRoute } from '@conduit8/core';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@web/lib/clients';
import { toast } from 'sonner';

/**
 * Hook to delete a skill (admin only)
 * Uses React Query mutation for cache invalidation and error handling
 */
export function useDeleteSkill() {
  const queryClient = useQueryClient();

  return useMutation<void, Error, string>({
    mutationFn: async (slug: string) => {
      const route = getApiRoute('admin_skill_delete').replace(':slug', slug);
      await api.delete(route);
    },

    onSuccess: () => {
      // Invalidate skills list to refetch without deleted skill
      queryClient.invalidateQueries({ queryKey: ['skills'] });

      // Show success toast
      toast.success('Skill deleted successfully');
    },

    onError: () => {
      // Show error toast
      toast.error('Failed to delete skill');
    },
  });
}
