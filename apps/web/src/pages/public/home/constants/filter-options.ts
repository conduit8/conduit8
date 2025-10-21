/**
 * Shared filter and sort options for skills browsing
 */

export const CATEGORY_OPTIONS = [
  { value: 'documents', label: 'Documents' },
  { value: 'creative', label: 'Creative' },
  { value: 'development', label: 'Development' },
  { value: 'testing', label: 'Testing' },
  { value: 'data', label: 'Data' },
  { value: 'media', label: 'Media' },
  { value: 'devops', label: 'DevOps' },
] as const;

export const SORT_OPTIONS = [
  { value: 'downloads', label: 'Most Downloaded' },
  { value: 'recent', label: 'Recently Added' },
  { value: 'az', label: 'A-Z' },
  { value: 'za', label: 'Z-A' },
] as const;

export const SOURCE_OPTIONS = [
  { value: 'verified', label: 'Verified' },
  { value: 'community', label: 'Community' },
] as const;

export type CategoryValue = typeof CATEGORY_OPTIONS[number]['value'];
export type SortValue = typeof SORT_OPTIONS[number]['value'];
export type SourceValue = typeof SOURCE_OPTIONS[number]['value'];
