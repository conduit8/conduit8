import type { ReactNode } from 'react';

import { cn } from '@web/lib/utils';

interface LandingSectionProps {
  children: ReactNode;
  className?: string;
  id?: string;
  variant?: 'default' | 'full-width';
  background?: 'default' | 'surface';
}

/**
 * Thin wrapper for consistent landing page sections
 * Handles common section padding and container constraints
 */
export function LandingSectionWrapper({
  children,
  className,
  id,
  variant = 'default',
  background = 'default',
}: LandingSectionProps) {
  return (
    <section
      id={id}
      className={cn(
        'section-padding',
        background === 'surface' && 'bg-surface',
      )}
    >
      <div className={cn(
        'flex flex-col gap-10',
        'items-start text-left', // mobile default
        'md:items-center md:text-center', // desktop centered
        variant === 'default' && 'container-max-w-6xl',
        variant === 'full-width' && 'w-full',
        className,
      )}
      >
        {children}
      </div>
    </section>
  );
}
