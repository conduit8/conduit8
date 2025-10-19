import type { VariantProps } from 'class-variance-authority';

import { cn } from '@web/lib/utils';
import { cva } from 'class-variance-authority';
import { Slot as SlotPrimitive } from 'radix-ui';
import * as React from 'react';

const buttonVariants = cva(
  'cursor-pointer inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md'
  + ' text-sm' // 14px base size
  + ' font-medium  transition-all disabled:cursor-not-allowed disabled:opacity-50'
  + ' active:scale-98 active:origin-top' // Compress from top on press
  + ' [&_svg]:pointer-events-none [&_svg:not([class*=\'size-\'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive',
  {
    variants: {
      variant: {
        default: 'bg-foreground text-background hover:bg-foreground/90',
        secondary: 'bg-muted hover:bg-surface-hover',
        outline:
          'border border-border-non-interactive bg-background  '
          + 'hover:bg-background-hover hover:border-border-interactive'
          + ' active:border-border-interactive-strong'
          + ' dark:bg-surface dark:border-border-interactive dark:hover:bg-surface-hover',
        destructive:
          'bg-destructive text-destructive-foreground  hover:bg-destructive-hover'
          + ' focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 ',
        accent: 'bg-background text-foreground border border-foreground hover:border-accent',
        ghost: 'hover:bg-background-hover',
        link: 'text-accent underline-offset-4 hover:underline',
      },
      size: {
        default: 'h-9 px-4 py-2 has-[>svg]:px-3',
        sm: 'h-8 rounded-md gap-1.5 text-xs px-3 has-[>svg]:px-2.5', // 12px for small
        lg: 'h-11 rounded-md px-6 text-lg has-[>svg]:px-5', // 18px for large, 44px height
        icon: 'size-9',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
);

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<'button'>
  & VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
  }) {
  const Comp = asChild ? SlotPrimitive.Slot : 'button';

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}

export { Button, buttonVariants };
