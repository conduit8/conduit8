import type { SkillCategory, SubmissionStatus } from '@conduit8/core';

import { SKILL_CATEGORIES } from '@conduit8/core';
import { trackSkillCategorySelected } from '@web/lib/analytics';
import { Badge } from '@web/ui/components/atoms/indicators';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@web/ui/components/atoms/inputs';
import { useState } from 'react';

import { SKILL_CATEGORY_ICONS, SKILL_CATEGORY_LABELS } from '@web/pages/shared/models/skill-categories';

import { useUpdateSubmission } from '../hooks/use-update-submission';

interface EditableCategoryBadgeProps {
  submissionId: string;
  currentCategory: SkillCategory;
  currentStatus: SubmissionStatus;
}

const CATEGORY_DESCRIPTIONS: Record<SkillCategory, string> = {
  development: 'Backend, Frontend, DevOps, Security, Testing',
  content: 'Marketing Copy, Internal Comms, Research, Brand',
  documents: 'Office, Forms, Presentations',
  data: 'Analysis, Visualization, ETL',
  design: 'Graphic Design, Generative Art, UI/UX, Media',
  marketing: 'SEO, Conversion, Sales',
  business: 'Strategy, Finance, Operations',
};

export function EditableCategoryBadge({ submissionId, currentCategory, currentStatus }: EditableCategoryBadgeProps) {
  const [isEditing, setIsEditing] = useState(false);
  const { mutate: updateCategory, isPending } = useUpdateSubmission(submissionId, currentStatus);

  const handleCategoryChange = (newCategory: string) => {
    updateCategory({ category: newCategory as SkillCategory }, {
      onSuccess: () => {
        setIsEditing(false);
        trackSkillCategorySelected(newCategory);
      },
    });
  };

  if (!isEditing) {
    const Icon = SKILL_CATEGORY_ICONS[currentCategory];
    return (
      <Badge
        variant="neutral"
        className="cursor-pointer hover:bg-muted transition-colors"
        onClick={() => setIsEditing(true)}
      >
        <Icon weight="duotone" />
        {SKILL_CATEGORY_LABELS[currentCategory]}
      </Badge>
    );
  }

  return (
    <Select
      value={currentCategory}
      onValueChange={handleCategoryChange}
      disabled={isPending}
      open={isEditing}
      onOpenChange={setIsEditing}
    >
      <SelectTrigger className="w-[200px] h-7">
        <SelectValue>
          {(() => {
            const Icon = SKILL_CATEGORY_ICONS[currentCategory];
            return (
              <div className="flex items-center gap-2">
                <Icon className="size-4 text-muted-foreground" />
                <span>{SKILL_CATEGORY_LABELS[currentCategory]}</span>
              </div>
            );
          })()}
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        {SKILL_CATEGORIES.map((category) => {
          const Icon = SKILL_CATEGORY_ICONS[category];
          return (
            <SelectItem
              key={category}
              value={category}
              className="w-full text-start"
            >
              <div className="flex flex-col gap-1 w-full py-0.5">
                <div className="flex items-center gap-2">
                  <Icon className="size-4 text-muted-foreground" />
                  <span>{SKILL_CATEGORY_LABELS[category]}</span>
                </div>
                <div className="text-xs text-muted-foreground pl-6">
                  {CATEGORY_DESCRIPTIONS[category]}
                </div>
              </div>
            </SelectItem>
          );
        })}
      </SelectContent>
    </Select>
  );
}
