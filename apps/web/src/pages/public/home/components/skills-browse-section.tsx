import type { Skill } from '@conduit8/core';

import { MagnifyingGlassIcon, PlusIcon } from '@phosphor-icons/react';
import { Button } from '@web/ui/components/atoms/buttons';
import { Input } from '@web/ui/components/atoms/inputs';

import { ContentGrid } from '@web/ui/components/layout/content/content-grid';
import { FilterDropdown } from '@web/ui/components/overlays/filter-dropdown';

import type { CategoryValue, SortValue, SourceValue } from '../constants/filter-options';

import { CATEGORY_OPTIONS, SORT_OPTIONS, SOURCE_OPTIONS } from '../constants/filter-options';
import { EmptyState } from './empty-state';
import { LandingSectionWrapper } from './landing-section-wrapper';
import { SkillCard } from './skill-card';
import { SkillCardSkeleton } from './skill-card-skeleton';

interface SkillsBrowseSectionProps {
  skills: Skill[];
  onSkillClick: (slug: string) => void;
  isPending?: boolean;
  onSubmitClick: () => void;
  onSearchChange: (value: string) => void;
  selectedCategories: CategoryValue[];
  onCategoryChange: (categories: CategoryValue[]) => void;
  sortBy: SortValue;
  onSortChange: (value: SortValue) => void;
  selectedSources: SourceValue[];
  onSourceChange: (sources: SourceValue[]) => void;
  onResetFilters: () => void;
  showPendingSkills?: boolean;
  onTogglePendingSkills?: (show: boolean) => void;
  pendingCount?: number;
}

export function SkillsBrowseSection({
  skills,
  onSkillClick,
  isPending = false,
  onSubmitClick,
  onSearchChange,
  selectedCategories,
  onCategoryChange,
  sortBy,
  onSortChange,
  selectedSources,
  onSourceChange,
  onResetFilters,
  showPendingSkills = true,
  onTogglePendingSkills,
  pendingCount = 0,
}: SkillsBrowseSectionProps) {
  return (
    <LandingSectionWrapper variant="default">
      <div className="w-full flex flex-col gap-4">
        {/* Row 1: Actions (left) + Stats (right) */}
        <div className="w-full flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="accent" onClick={onSubmitClick}>
              <PlusIcon size={16} weight="fill" className="text-accent" />
              Submit
            </Button>

            {/* Status Toggle */}
            {onTogglePendingSkills && (
              <div className="flex items-center gap-2">
                <Button
                  variant={showPendingSkills ? "default" : "outline"}
                  size="sm"
                  onClick={() => onTogglePendingSkills(true)}
                >
                  All Skills
                </Button>
                <Button
                  variant={!showPendingSkills ? "default" : "outline"}
                  size="sm"
                  onClick={() => onTogglePendingSkills(false)}
                >
                  Approved Only
                </Button>
              </div>
            )}
          </div>

          <div className="flex items-center gap-4">
            {/* Pending Queue Counter */}
            {pendingCount > 0 && (
              <div className="text-sm text-muted-foreground">
                <span className="font-medium text-warning">{pendingCount}</span>
                <span className="ml-1">pending review</span>
              </div>
            )}

            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <span className="font-medium text-foreground">
                {isPending ? '...' : skills.length}
              </span>
              <span>{skills.length === 1 ? 'skill' : 'skills'}</span>
            </div>
          </div>
        </div>

        {/* Row 2: Search (left) + Filters (right) */}
        <div className="w-full flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <MagnifyingGlassIcon
              className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
              size={16}
            />
            <Input
              type="text"
              placeholder="Search skills..."
              className="pl-10"
              onChange={e => onSearchChange(e.target.value)}
            />
          </div>

          <div className="flex items-center gap-2 md:gap-4">
            <FilterDropdown
              label="Category"
              value={selectedCategories}
              onChange={onCategoryChange as (value: string | string[]) => void}
              options={CATEGORY_OPTIONS}
              multi
              width="w-32"
            />

            <FilterDropdown
              label="Sort"
              value={sortBy}
              onChange={onSortChange as (value: string | string[]) => void}
              options={SORT_OPTIONS}
              width="w-36"
            />

            <FilterDropdown
              label="Source"
              value={selectedSources}
              onChange={onSourceChange as (value: string | string[]) => void}
              options={SOURCE_OPTIONS}
              multi
              width="w-28"
            />
          </div>
        </div>

        {/* Loading, empty, or grid */}
        {isPending
          ? (
              <ContentGrid columns={3} className="w-full">
                {Array.from({ length: 6 }, (_, i) => `skeleton-${i}`).map(key => (
                  <SkillCardSkeleton key={key} />
                ))}
              </ContentGrid>
            )
          : skills.length === 0
            ? (
                <EmptyState onResetFilters={onResetFilters} />
              )
            : (
                <ContentGrid columns={3} className="w-full">
                  {skills.map(skill => (
                    <SkillCard
                      key={skill.slug}
                      {...skill}
                      onClick={() => onSkillClick(skill.slug)}
                    />
                  ))}
                </ContentGrid>
              )}
      </div>
    </LandingSectionWrapper>
  );
}
