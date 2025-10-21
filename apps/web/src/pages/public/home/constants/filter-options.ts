import type { SkillAuthorKind, SkillCategory } from '@conduit8/core';

import { SKILL_AUTHOR_KINDS, SKILL_CATEGORIES } from '@conduit8/core';

/**
 * Shared filter and sort options for skills browsing
 *
 * Categories and sources import from Core domain model (single source of truth)
 * This ensures filters work with pagination and always show all available options
 */

/**
 * Format domain string to human-readable label
 * Handles kebab-case, snake_case, and multi-word strings
 */
function formatLabel(str: string): string {
  return str
    .split(/[-_]/)
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

// Map domain categories to UI labels
export const CATEGORY_OPTIONS = SKILL_CATEGORIES.map(category => ({
  value: category,
  label: formatLabel(category),
}));

// Map domain author kinds to UI labels
export const SOURCE_OPTIONS = SKILL_AUTHOR_KINDS.map(kind => ({
  value: kind,
  label: formatLabel(kind),
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
