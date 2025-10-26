import type { JSX } from 'react';

import { buildProxyImageUrl, cn } from '@web/lib/utils';
import React, { useMemo, useState } from 'react';

import type { AuthUser } from '@web/lib/auth/models/auth-user';

import { Skeleton } from '@web/ui/components/feedback/progress/skeleton';

interface UserAvatarImageProps {
  user: AuthUser;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

/**
 * Displays user avatar image with fallback to initials
 * Handles image loading and error states
 */
const UserAvatarImage = ({ user, size = 'md', className }: UserAvatarImageProps) => {
  const sizeClasses = {
    sm: 'size-6 text-sm',
    md: 'size-8 text-base',
    lg: 'size-10 text-lg',
  };

  const imageUrl = buildProxyImageUrl(user.avatarUrl);
  const [imageLoading, setImageLoading] = useState(true);
  const [imageError, setImageError] = useState(false);

  // Generate background color for initials
  const backgroundColor = useMemo(() => {
    const str = user.id || user.email || '';
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    const colors = ['bg-chart-1', 'bg-chart-2', 'bg-chart-3', 'bg-chart-4', 'bg-chart-5'];
    return colors[Math.abs(hash) % colors.length];
  }, [user.id, user.email]);

  return (
    <div className={cn('relative', className)}>
      {/* Image with loading state */}
      {imageUrl && !imageError && (
        <>
          {imageLoading && (
            <Skeleton className={cn('rounded-full', sizeClasses[size])} />
          )}
          <img
            src={imageUrl}
            alt={`${user.email}'s avatar`}
            className={cn(
              'rounded-full object-cover',
              sizeClasses[size],
              imageLoading && 'invisible',
            )}
            onLoad={() => setImageLoading(false)}
            onError={() => {
              setImageLoading(false);
              setImageError(true);
            }}
          />
        </>
      )}

      {/* Initials fallback */}
      {(!imageUrl || imageError) && (
        <div
          className={cn(
            'text-primary-foreground flex items-center justify-center rounded-full font-medium',
            backgroundColor,
            sizeClasses[size],
          )}
          aria-label={`${user.email}'s avatar`}
        >
          {user.initials}
        </div>
      )}
    </div>
  );
};

interface UserNameProps {
  user: AuthUser;
  className?: string;
}

/**
 * Displays user name and email
 * Shows name if available, otherwise shows email as primary
 */
const UserName = ({ user, className }: UserNameProps) => {
  return (
    <div className={cn('flex min-w-0 flex-1 flex-col', className)}>
      {user.displayName && (
        <span className="text-foreground truncate text-sm font-medium" title={user.displayName}>
          {user.displayName}
        </span>
      )}
      <span
        className={cn(
          'truncate',
          user.displayName
            ? 'text-muted-foreground text-xs'
            : 'text-foreground text-sm font-medium',
        )}
        title={user.email}
      >
        {user.email}
      </span>
    </div>
  );
};

export interface UserAvatarProps {
  user: AuthUser;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  variant?: 'default' | 'image-only';
  badgeCount?: number;
}

export const UserAvatar = ({
  ref,
  user,
  size = 'md',
  className,
  variant = 'default',
  badgeCount,
  ...buttonProps
}: UserAvatarProps & { ref?: React.RefObject<HTMLButtonElement | null> }): JSX.Element => {
  const showBadge = badgeCount !== undefined && badgeCount > 0;

  if (variant === 'image-only') {
    return (
      <button
        ref={ref}
        type="button"
        tabIndex={0}
        className={cn('relative flex cursor-pointer', className)}
        {...buttonProps}
      >
        <UserAvatarImage user={user} size={size} />
        {showBadge && (
          <span className="absolute -top-1.5 -right-1.5 flex h-4 min-w-[1rem] items-center justify-center rounded-full bg-destructive px-1 text-xs font-semibold text-background ring-2 ring-background">
            {badgeCount}
          </span>
        )}
      </button>
    );
  }

  // Default variant with conditional name and email
  return (
    <button
      ref={ref}
      type="button"
      tabIndex={0}
      className={cn(
        'hover:bg-surface-hover flex w-full cursor-pointer items-center gap-3 rounded-md p-2 text-left',
        className,
      )}
      {...buttonProps}
    >
      <div className="relative flex-shrink-0">
        <UserAvatarImage user={user} size={size} />
        {showBadge && (
          <span className="absolute -top-1.5 -right-1.5 flex h-4 min-w-[1rem] items-center justify-center rounded-full bg-destructive px-1 text-xs font-semibold text-background ring-2 ring-background">
            {badgeCount}
          </span>
        )}
      </div>
      <UserName user={user} />
    </button>
  );
};

UserAvatar.displayName = 'UserAvatar';
