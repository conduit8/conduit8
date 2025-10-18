import type { LinkProps } from '@tanstack/react-router';

import { Link } from '@tanstack/react-router';
import { cn } from '@web/lib/utils';

export const UnstyledLink = ({
  ref,
  className,
  ...props
}: LinkProps & { className?: string } & { ref?: React.RefObject<HTMLAnchorElement | null> }) => {
  return (
    <Link ref={ref} className={cn('hover:no-underline', className)} preload={false} {...props} />
  );
};

UnstyledLink.displayName = 'UnstyledLink';
