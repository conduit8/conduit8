import { z } from 'zod';

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

/**
 * Schema for SKILL.md frontmatter
 */
export const SkillFrontmatterSchema = z.object({
  'name': z.string().min(1).max(100),
  'description': z.string().min(1).max(500),
  'license': z.string().min(1),
  'allowed-tools': z.string(),
});

/**
 * Schema for skill validation
 * Parser transforms: name → slug, 'allowed-tools' → allowedTools
 * AI categorization adds category field
 */
export const SkillSchema = SkillFrontmatterSchema
  .omit({ 'name': true, 'allowed-tools': true })
  .extend({
    slug: z.string().min(1).max(100).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
    allowedTools: z.array(z.string()),
    displayName: z.string().min(1).max(100),
    category: z.enum(SKILL_CATEGORIES),
    author: z.string().min(1).max(100),
    authorKind: z.enum(SKILL_AUTHOR_KINDS),
    sourceType: z.enum(SKILL_SOURCE_TYPES),
    sourceUrl: z.url(),
    examples: z.array(z.string()).min(1).max(10),
    curatorNote: z.string().nullable(),
  });

export type SkillFrontmatter = z.infer<typeof SkillFrontmatterSchema>;
export type SkillData = z.infer<typeof SkillSchema>;
