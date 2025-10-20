import { Skeleton } from '@web/ui/components/feedback/progress/skeleton';
import { Card } from '@web/ui/components/layout/containers/card';

export function SkillCardSkeleton() {
  return (
    <Card className="outline outline-1 outline-border overflow-hidden p-0 flex flex-col h-full border-0">
      {/* Image */}
      <Skeleton className="aspect-video w-full" />

      {/* Content */}
      <div className="p-4 flex flex-col gap-3">
        {/* Title */}
        <Skeleton className="h-5 w-3/4" />

        {/* Description (2 lines) */}
        <div className="space-y-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
        </div>

        {/* Badges */}
        <div className="flex gap-2">
          <Skeleton className="h-5 w-20" />
          <Skeleton className="h-5 w-16" />
        </div>

        {/* Button */}
        <Skeleton className="h-9 w-full" />
      </div>
    </Card>
  );
}
