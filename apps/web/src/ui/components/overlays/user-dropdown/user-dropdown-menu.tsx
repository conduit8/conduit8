import type { AuthUser } from '@web/lib/auth/models';

import { ListChecksIcon, SignOutIcon, UserIcon } from '@phosphor-icons/react';
import { useQuery } from '@tanstack/react-query';
import { useRouter } from '@tanstack/react-router';
import { authService } from '@web/lib/auth';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@web/ui/components/overlays';
import { toast } from 'sonner';

import { skillsApi } from '@web/pages/public/home/services/skills-api';
import { SubmissionsCollection } from '@web/pages/shared/models/submissions-collection';

import { UserAvatar } from './user-avatar';

interface UserDropdownMenuProps {
  user: AuthUser;
  imageOnly?: boolean;
}

export function UserDropdownMenu({ user, imageOnly = false }: UserDropdownMenuProps) {
  const variant = imageOnly ? 'image-only' : 'default';
  const router = useRouter();
  const { signOut } = authService();

  // Fetch all submissions (shared cache with My Submissions page)
  const { data } = useQuery({
    queryKey: ['submissions', false], // false = not admin
    queryFn: () => skillsApi.listSubmissions({ limit: 100, offset: 0 }),
  });

  const collection = new SubmissionsCollection(data?.data ?? []);
  const pendingCount = collection.pendingCount;

  const handleSignOut = async () => {
    const result = await signOut();
    if (result.success) {
      router.invalidate();
    }
    else {
      console.error(result.message);
      toast.error('Failed to sign out - please try again');
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <UserAvatar user={user} variant={variant} badgeCount={pendingCount} />
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className={imageOnly ? 'min-w-[200px]' : 'w-[var(--radix-dropdown-menu-trigger-width)]'}
        align="start"
      >
        <DropdownMenuItem
          onClick={() => router.navigate({ to: '/' })}
          icon={<UserIcon size={16} />}
        >
          Profile
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => router.navigate({ to: '/my-submissions' })}
          icon={<ListChecksIcon size={16} />}
        >
          {pendingCount > 0 ? `My Submissions (${pendingCount})` : 'My Submissions'}
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={handleSignOut}
          variant="destructive"
          icon={<SignOutIcon size={16} />}
        >
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
