import type { ReactNode } from 'react';

import { cn } from '@web/lib/utils';

export interface FeatureBlockProps {
  icon: ReactNode;
  featureName: string;
  title: string;
  subtitle: string;
  visual: ReactNode;
  className?: string;
}

export function FeatureBlock({
  icon,
  featureName,
  title,
  subtitle,
  visual,
  className,
}: FeatureBlockProps) {
  return (
    <div className={cn('flex flex-col gap-8', className)}>
      <div className="flex flex-col gap-2 h-24">
        <div className="text-muted-foreground flex items-center gap-2">
          <span className="">{icon}</span>
          <span className="font-medium">{featureName}</span>
        </div>
        <p className="text-subtitle font-medium text-start">
          <span className="font-medium">{title}</span>
          {' '}
          <span className="text-muted-foreground">{subtitle}</span>
        </p>
      </div>
      <div className="bg-background group relative rounded-xl p-2">
        <div className="bg-surface border-border/50 hover:border-accent relative h-56 w-full overflow-hidden rounded-lg border transition-all duration-300">
          {visual}
        </div>
      </div>
    </div>
  );
}
