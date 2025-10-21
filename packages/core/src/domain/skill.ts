/**
 * Skill domain constants and types
 * Single source of truth for skill-related domain concepts
 */

/**
 * Canonical skill categories - MECE (Mutually Exclusive, Collectively Exhaustive)
 * Designed for future sub-categorization:
 * - Development: Backend, Frontend, DevOps, Security, Testing
 * - Content: Marketing Copy, Internal Comms, Research, Brand
 * - Documents: Office, Forms, Presentations
 * - Data: Analysis, Visualization, ETL
 * - Design: Graphic Design, Generative Art, UI/UX, Media
 * - Marketing: SEO, Conversion, Sales
 * - Business: Strategy, Finance, Operations
 */
export const SKILL_CATEGORIES = [
  'development',
  'content',
  'documents',
  'data',
  'design',
  'marketing',
  'business',
] as const;

/**
 * How the skill was added to the platform
 * - import: Bulk import from external source
 * - pr: Community pull request
 * - submission: User submission via form
 */
export const SKILL_SOURCE_TYPES = [
  'import',
  'pr',
  'submission',
] as const;

/**
 * Author verification status
 * - verified: Official/verified author (e.g., Anthropic, trusted partners)
 * - community: Community-contributed skill
 */
export const SKILL_AUTHOR_KINDS = [
  'verified',
  'community',
] as const;

export type SkillCategory = typeof SKILL_CATEGORIES[number];
export type SkillSourceType = typeof SKILL_SOURCE_TYPES[number];
export type SkillAuthorKind = typeof SKILL_AUTHOR_KINDS[number];
