import type { SkillAuthorKind, SkillCategory, SkillSourceType, UUIDv4 } from '@conduit8/core';

import { SkillSchema } from '@conduit8/core';
import { ZodError } from 'zod';

import { InvalidSkillMetadataError } from '@worker/infrastructure/errors/domain.errors';

import { AggregateRoot } from './base.models';

/**
 * Skill aggregate root
 * Enforces business rules and invariants
 */
export class Skill extends AggregateRoot {
  constructor(
    public readonly id: UUIDv4,
    public readonly slug: string,
    public readonly displayName: string,
    public readonly description: string,
    public readonly category: SkillCategory,
    public readonly zipKey: string,
    public readonly imageKey: string,
    public readonly examples: string[],
    public readonly curatorNote: string | null,
    public readonly author: string,
    public readonly authorKind: SkillAuthorKind,
    public readonly sourceType: SkillSourceType,
    public readonly sourceUrl: string,
  ) {
    super();
  }

  /**
   * Factory: Create and validate new Skill
   * Validates parsed data, generates id/zipKey/imageKey
   */
  static create(data: Record<string, any>): Skill {
    try {
      // Parse allowed-tools from frontmatter string to array
      const allowedTools = data['allowed-tools']
        ? String(data['allowed-tools']).split(' ').filter(Boolean)
        : [];

      const validated = SkillSchema.parse({
        ...data,
        allowedTools,
      });
      const id = crypto.randomUUID();

      return new Skill(
        id,
        validated.slug,
        validated.displayName,
        validated.description,
        validated.category,
        `skills/${validated.slug}.zip`,
        `images/${validated.slug}.png`,
        validated.examples,
        validated.curatorNote,
        validated.author,
        validated.authorKind,
        validated.sourceType,
        validated.sourceUrl,
      );
    }
    catch (error) {
      if (error instanceof ZodError) {
        console.error('[Skill.create] Validation failed', { errors: error.issues, data });
        throw new InvalidSkillMetadataError('Invalid skill metadata');
      }
      throw error;
    }
  }
}
