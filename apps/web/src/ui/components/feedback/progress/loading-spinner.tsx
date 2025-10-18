import { Loader2 } from 'lucide-react';
import React from 'react';

import { cn } from '@web/lib/utils/tailwind-utils';

interface LoadingFallbackProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  text?: string | undefined;
}

/**
 * LoadingSpinner component
 *
 * A circular loading spinner for indeterminate loading states.
 * Uses Radix UI styling conventions and theme colors.
 * Designed for Suspense boundaries and loading states.
 *
 * @example
 * // Basic usage
 * <LoadingSpinner />
 *
 * // With custom size and text
 * <LoadingSpinner size="lg" text="Processing..." />
 *
 * // Without text
 * <LoadingSpinner text="" />
 *
 * @param size - 'sm' | 'md' | 'lg' (default: 'md')
 * @param text - String to display below spinner (default: 'Loading...')
 * @param className - Optional custom classes
 */
export const LoadingSpinner: React.FC<LoadingFallbackProps> = ({
  className,
  size = 'md',
  text = 'Loading...',
}) => {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8',
    lg: 'h-12 w-12',
  };

  return (
    <div
      className={cn(
        'flex h-full min-h-[200px] w-full flex-col items-center justify-center gap-4',
        className,
      )}
    >
      <Loader2 className={cn('text-primary animate-spin', sizeClasses[size])} />
      {text && <p className="text-muted-foreground animate-pulse text-sm">{text}</p>}
    </div>
  );
};

export default LoadingSpinner;
