import type { ReactNode } from 'react';

import { cn } from '@web/lib/utils';

import { AnimatedGridPattern } from '@web/ui/components/atoms/effects/animated-grid-pattern';

interface LandingBackgroundProps {
  children: ReactNode;
}

/**
 * Landing page background with animated grid pattern
 */
export function LandingBackground({ children }: LandingBackgroundProps) {
  return (
    <div className="min-h-screen relative overflow-hidden bg-background">
      <AnimatedGridPattern
        numSquares={30}
        maxOpacity={0.15}
        duration={3}
        repeatDelay={1}
        className={cn(
          '[mask-image:radial-gradient(700px_circle_at_center,white,transparent)]',
          'inset-x-0 inset-y-[-30%] h-[200%] skew-y-12',
        )}
      />
      {children}
    </div>
  );
}
