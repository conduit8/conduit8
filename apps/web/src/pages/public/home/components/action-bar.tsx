import { MagnifyingGlass, PlusIcon } from '@phosphor-icons/react';
import { Button } from '@web/ui/components/atoms/buttons';
import { Input } from '@web/ui/components/atoms/inputs';
import { FilterPopover } from '@web/ui/components/overlays/filter-popover';

import { LandingSectionWrapper } from './landing-section-wrapper';

interface ActionBarProps {
  onSubmitClick: () => void;
  onSearchChange: (value: string) => void;
  selectedCategories: string[];
  onCategoryChange: (categories: string[]) => void;
  sortBy: string;
  onSortChange: (value: string) => void;
  selectedSources: string[];
  onSourceChange: (sources: string[]) => void;
}

const CATEGORY_OPTIONS = [
  { value: 'documents', label: 'Documents' },
  { value: 'creative', label: 'Creative' },
  { value: 'development', label: 'Development' },
  { value: 'testing', label: 'Testing' },
  { value: 'data', label: 'Data' },
  { value: 'media', label: 'Media' },
  { value: 'devops', label: 'DevOps' },
];

const SORT_OPTIONS = [
  { value: 'downloads', label: 'Most Downloaded' },
  { value: 'recent', label: 'Recently Added' },
  { value: 'az', label: 'A-Z' },
  { value: 'za', label: 'Z-A' },
];

const SOURCE_OPTIONS = [
  { value: 'verified', label: 'Verified' },
  { value: 'community', label: 'Community' },
];

export function ActionBar({
  onSubmitClick,
  onSearchChange,
  selectedCategories,
  onCategoryChange,
  sortBy,
  onSortChange,
  selectedSources,
  onSourceChange,
}: ActionBarProps) {
  return (
    <LandingSectionWrapper variant="default" className="py-0 md:py-0 pb-6">
      <div className="w-full flex items-center gap-4">
        {/* Submit button */}
        <Button variant="accent" onClick={onSubmitClick}>
          <PlusIcon size={16} weight="fill" />
          Submit
        </Button>

        {/* Search input - takes remaining width */}
        <div className="relative flex-1">
          <MagnifyingGlass
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

        {/* Category filter - multi-select */}
        <FilterPopover
          value={selectedCategories}
          onChange={onCategoryChange as (value: string | string[]) => void}
          options={CATEGORY_OPTIONS}
          multi
          width="w-[140px]"
        />

        {/* Sort filter - single select */}
        <FilterPopover
          value={sortBy}
          onChange={onSortChange as (value: string | string[]) => void}
          options={SORT_OPTIONS}
          width="w-[160px]"
        />

        {/* Source filter - multi-select */}
        <FilterPopover
          value={selectedSources}
          onChange={onSourceChange as (value: string | string[]) => void}
          options={SOURCE_OPTIONS}
          multi
          width="w-[120px]"
        />
      </div>
    </LandingSectionWrapper>
  );
}
