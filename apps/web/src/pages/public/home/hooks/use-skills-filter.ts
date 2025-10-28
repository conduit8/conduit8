import type { SkillDetail } from '@conduit8/core';

import { useMemo } from 'react';

import type { CategoryValue, SortValue, SourceValue } from '../constants/filter-options';

export interface SkillsFilterOptions {
  categories: CategoryValue[];
  sources: SourceValue[];
  sortBy: SortValue;
}

/**
 * Hook to filter and sort skills based on user-selected criteria
 * Extracts filtering logic following Single Responsibility Principle
 */
export function useSkillsFilter(
  skills: SkillDetail[] | undefined,
  options: SkillsFilterOptions,
): SkillDetail[] {
  return useMemo(() => {
    // Return empty during loading - UI component handles loading state
    if (!skills)
      return [];

    let result = [...skills];

    // Category filter
    if (options.categories.length > 0) {
      result = result.filter(
        skill => skill.category && options.categories.includes(skill.category),
      );
    }

    // Source filter
    if (options.sources.length > 0) {
      result = result.filter(skill => options.sources.includes(skill.authorKind));
    }

    // Sort
    result.sort((a, b) => {
      switch (options.sortBy) {
        case 'downloads':
          return b.downloadCount - a.downloadCount;
        case 'recent':
          return 0; // TODO: Need createdAt timestamp
        case 'az':
          return a.name.localeCompare(b.name);
        case 'za':
          return b.name.localeCompare(a.name);
        default:
          return 0;
      }
    });

    return result;
  }, [skills, options.categories, options.sources, options.sortBy]);
}
