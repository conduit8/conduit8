import type { AuthUser } from '@web/lib/auth/models';

import { SignOutIcon, UserIcon } from '@phosphor-icons/react';
import { useRouter } from '@tanstack/react-router';
import { authService } from '@web/lib/auth';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@web/ui/components/overlays';
import { toast } from 'sonner';

import { UserAvatar } from './user-avatar';

interface UserDropdownMenuProps {
  user: AuthUser;
  imageOnly?: boolean;
}

export function UserDropdownMenu({ user, imageOnly = false }: UserDropdownMenuProps) {
  const variant = imageOnly ? 'image-only' : 'default';
  const router = useRouter();
  const { signOut } = authService();

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
        <UserAvatar user={user} variant={variant} />
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className={imageOnly ? 'min-w-[200px]' : 'w-[var(--radix-dropdown-menu-trigger-width)]'}
        align="start"
      >
        <DropdownMenuItem
          onClick={() => router.navigate({ to: '/' })}
          icon={<UserIcon size={16} />}
        >
          Account settings
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
