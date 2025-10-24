import { Badge } from '@web/ui/components/atoms/indicators/badge';
import { Button } from '@web/ui/components/atoms/buttons/button';
import { Card } from '@web/ui/components/layout/containers/card';
import type { SkillData } from '@conduit8/core';

interface SkillReviewCardProps {
  skill: SkillData;
  onViewDetails: (slug: string) => void;
}

/**
 * Skill review card component
 * Shows basic skill info with action buttons
 */
export function SkillReviewCard({ skill, onViewDetails }: SkillReviewCardProps) {
  return (
    <Card className="p-4">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 space-y-2">
          <div className="flex items-center gap-2">
            <h3 className="font-semibold text-lg">{skill.displayName}</h3>
            <Badge variant="neutral">{skill.category}</Badge>
          </div>

          <p className="text-sm text-muted-foreground line-clamp-2">
            {skill.description}
          </p>

          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <span>By: {skill.author}</span>
            <span>•</span>
            <span>Source: {skill.sourceType}</span>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onViewDetails(skill.slug)}
          >
            View Details
          </Button>
        </div>
      </div>
    </Card>
  );
}
