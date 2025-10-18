import { cn } from '@web/lib/utils';
import * as React from 'react';

function Input({ className, type, ...props }: React.ComponentProps<'input'>) {
  const hideNumberSpinners
    = type === 'number'
      ? 'appearance-none [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none [appearance:textfield]'
      : '';

  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        'file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground bg-surface border-border-non-interactive shadow-xs flex h-9 w-full min-w-0 rounded-md border px-3 py-1 text-base outline-none transition-[color,box-shadow,border-color] file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm',
        'enabled:hover:border-border-interactive',
        'focus-visible:border-border-interactive-strong focus-visible:ring-ring/50 focus-visible:ring-[3px]',
        'aria-invalid:border-border-destructive-non-interactive aria-invalid:enabled:hover:border-border-destructive-interactive aria-invalid:focus-visible:border-border-destructive-interactive-strong',
        'aria-invalid:ring-destructive/20 aria-invalid:focus-visible:ring-destructive/20',
        hideNumberSpinners,
        className,
      )}
      {...props}
    />
  );
}

export { Input };
