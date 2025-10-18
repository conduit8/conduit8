import { Progress as ProgressPrimitive } from 'radix-ui';
import * as React from 'react';

import { cn } from '@web/lib/utils/tailwind-utils';

/**
 * Progress component
 *
 * A horizontal progress bar that visualizes completion percentage.
 *
 * @example
 * // Basic usage
 * <Progress value={33} />
 *
 * // With animation
 * <Progress value={75} animated />
 *
 * // Custom styling
 * <Progress value={75} className="h-2 w-64" />
 *
 *
 * @param value - Number between 0-100 representing completion percentage
 * @param animated - Whether to animate the filled portion with pulse effect
 * @param className - Optional custom classes for the root element
 *
 * Notes:
 * - The track (container) uses bg-muted for the background
 * - The indicator (fill) uses bg-primary for the filled portion
 * - Always visible when rendered; use conditional rendering to show/hide
 */
function Progress({
  className,
  indicatorClassName,
  value = 0,
  animated = false,
  ...props
}: React.ComponentProps<typeof ProgressPrimitive.Root> & {
  animated?: boolean;
  indicatorClassName?: string;
}) {
  return (
    <ProgressPrimitive.Root
      data-slot="progress"
      className={cn('bg-muted relative h-4 w-full overflow-hidden rounded-full', className)}
      {...props}
    >
      <ProgressPrimitive.Indicator
        className={cn(
          'bg-primary h-full w-full flex-1',
          value === 0 ? 'opacity-0 transition-opacity duration-300' : 'opacity-100 transition-all',
          animated && value && value > 0 && 'animate-pulse',
          indicatorClassName,
        )}
        style={{ transform: `translateX(-${100 - (value || 0)}%)` }}
      />
    </ProgressPrimitive.Root>
  );
}

export { Progress };
