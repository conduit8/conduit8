import { cn } from '@web/lib/utils';
import React from 'react';

interface DotBackgroundProps {
  children?: React.ReactNode;
  className?: string;
  dotSize?: number;
  dotColor?: string;
  fadeIntensity?: number;
}

export function DotBackground({
  children,
  className,
  dotSize = 20,
  dotColor = 'var(--border-interactive)',
  fadeIntensity = 20,
}: DotBackgroundProps) {
  return (
    <div className={cn('bg-background relative w-full overflow-hidden', className)}>
      <div
        className="absolute inset-0"
        style={{
          backgroundSize: `${dotSize}px ${dotSize}px`,
          backgroundImage: `radial-gradient(${dotColor} 1px, transparent 1px)`,
        }}
      />
      {/* Radial gradient for the faded look using our color system */}
      <div
        className="bg-background pointer-events-none absolute inset-0"
        style={{
          maskImage: `radial-gradient(ellipse_at_center, transparent ${fadeIntensity}%, black)`,
        }}
      />
      {children && <div className="relative z-10">{children}</div>}
    </div>
  );
}
