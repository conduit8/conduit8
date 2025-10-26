import type { VariantProps } from 'class-variance-authority';

import { Slot } from '@radix-ui/react-slot';
import { cn } from '@web/lib/utils';
import { cva } from 'class-variance-authority';
import * as React from 'react';

const badgeVariants = cva(
  'inline-flex items-center justify-center rounded-full border px-2 py-0.5 text-xs font-medium w-fit whitespace-nowrap shrink-0 [&>svg]:size-3 gap-1 [&>svg]:pointer-events-none transition-colors overflow-hidden',
  {
    variants: {
      variant: {
        neutral: 'bg-muted/40 border-border text-foreground',
        success: 'bg-success/10 border-success/20 text-success-muted-foreground',
        warning: 'bg-warning/10 border-warning/20 text-warning-muted-foreground',
        destructive: 'bg-destructive/10 border-destructive/20 text-destructive-muted-foreground',
        info: 'bg-info/10 border-info/20 text-info-muted-foreground',
        outline: 'border-border text-muted-foreground',
      },
    },
    defaultVariants: {
      variant: 'neutral',
    },
  },
);

function Badge({
  className,
  variant,
  asChild = false,
  ...props
}: React.ComponentProps<'span'>
  & VariantProps<typeof badgeVariants> & {
    asChild?: boolean;
  }) {
  const Comp = asChild ? Slot : 'span';

  return (
    <Comp data-slot="badge" className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
