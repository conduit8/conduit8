import { cn } from '@web/lib/utils';

interface ColumnGuidesProps {
  children: React.ReactNode;
  className?: string;
}

export function ColumnGuides({ children, className }: ColumnGuidesProps) {
  return (
    <div className={cn('relative', className)}>
      {/* Column lines container - absolute positioned to span full section height */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
        <div className="container-max-w-6xl relative h-full">
          {/* Left solid border */}
          <div className="bg-border/10 absolute bottom-0 left-4 top-0 w-px md:left-8" />

          {/* Inner dashed columns - ONLY visible on desktop */}
          <div className="absolute bottom-0 left-1/3 top-0 hidden w-px md:block">
            <div className="border-border/10 h-full border-l border-dashed" />
          </div>
          <div className="absolute bottom-0 right-1/3 top-0 hidden w-px md:block">
            <div className="border-border/10 h-full border-l border-dashed" />
          </div>

          {/* Right solid border */}
          <div className="bg-border/10 absolute bottom-0 right-4 top-0 w-px md:right-8" />
        </div>
      </div>

      {/* Actual content with proper z-index */}
      <div className="relative z-10">{children}</div>
    </div>
  );
}
