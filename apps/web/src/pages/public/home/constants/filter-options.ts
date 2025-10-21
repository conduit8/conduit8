import type { SkillAuthorKind, SkillCategory } from '@conduit8/core';

import { SKILL_AUTHOR_KINDS, SKILL_CATEGORIES } from '@conduit8/core';

/**
 * Shared filter and sort options for skills browsing
 *
 * Categories and sources import from Core domain model (single source of truth)
 * This ensures filters work with pagination and always show all available options
 */

// Map domain categories to UI labels
export const CATEGORY_OPTIONS = SKILL_CATEGORIES.map(category => ({
  value: category,
  label: category.charAt(0).toUpperCase() + category.slice(1),
}));

// Map domain author kinds to UI labels
export const SOURCE_OPTIONS = SKILL_AUTHOR_KINDS.map(kind => ({
  value: kind,
  label: kind.charAt(0).toUpperCase() + kind.slice(1),
}));

export const SORT_OPTIONS = [
  { value: 'downloads', label: 'Most Downloaded' },
  { value: 'recent', label: 'Recently Added' },
  { value: 'az', label: 'A-Z' },
  { value: 'za', label: 'Z-A' },
] as const;

// Type exports
export type CategoryValue = SkillCategory;
export type SortValue = typeof SORT_OPTIONS[number]['value'];
export type SourceValue = SkillAuthorKind;
