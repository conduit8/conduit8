import { ValidationError } from '@worker/infrastructure/errors';
import { z } from 'zod';

import { ValueObject } from '../base.models';

const ClaudeInstanceConfigSchema = z.object({
  anthropicKey: z
    .string()
    .min(1, 'Anthropic API key is required')
    .startsWith('sk-ant-', 'Must be a valid Anthropic API key "sk-ant-..."'),
  githubToken: z
    .string()
    .min(1, 'GitHub token is required')
    .refine(
      token => token.startsWith('ghp_') || token.startsWith('github_pat_'),
      'Must be a valid GitHub token (ghp_ or github_pat_)',
    ),
  firecrawlKey: z
    .string()
    .min(1, 'Firecrawl API key is required')
    .startsWith('fc-', 'Must be a valid Firecrawl API key "fc-..."')
    .optional(),
});

type ClaudeInstanceConfigUpdate = Partial<
  Pick<ClaudeInstanceConfig, 'githubToken' | 'anthropicKey' | 'firecrawlKey'>
>;

/**
 * Claude Code configuration containing credentials for API access.
 *
 * Contains:
 * - GitHub token for repository access
 * - Anthropic API key for Claude access
 * - Firecrawl API key for web scraping (optional)
 */
export class ClaudeInstanceConfig extends ValueObject<ClaudeInstanceConfig> {
  constructor(
    public readonly githubToken: string,
    public readonly anthropicKey: string,
    public readonly firecrawlKey?: string,
  ) {
    super();
  }

  /**
   * Factory method to create validated configuration
   */
  static create(data: unknown): ClaudeInstanceConfig {
    const validated = ClaudeInstanceConfigSchema.safeParse(data);

    if (!validated.success) {
      const errorMessages = validated.error.issues.map(err => `${err.path.join('.')}: ${err.message}`);
      const allFields = validated.error.issues.map(err => err.path.join('.')).join(', ');
      const combinedMessage = errorMessages.join('; ');

      throw new ValidationError(combinedMessage, allFields, validated.error);
    }

    return new ClaudeInstanceConfig(
      validated.data.githubToken,
      validated.data.anthropicKey,
      validated.data.firecrawlKey,
    );
  }

  /**
   * Check equality by value - compares the token and key values
   */
  equals(other: ClaudeInstanceConfig): boolean {
    return (
      this.githubToken === other.githubToken
      && this.anthropicKey === other.anthropicKey
      && this.firecrawlKey === other.firecrawlKey
    );
  }

  /**
   * Convert to plain object for persistence
   */
  toPlainObject(): Record<string, any> {
    return {
      githubToken: this.githubToken,
      anthropicKey: this.anthropicKey,
      firecrawlKey: this.firecrawlKey,
    };
  }
}
