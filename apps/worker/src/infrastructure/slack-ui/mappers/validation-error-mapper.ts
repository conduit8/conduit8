import type { ZodError } from 'zod';

/**
 * Maps Zod validation errors to Slack form field error format
 * Converts domain validation errors to user-friendly Slack UI errors
 */
export function mapZodErrorToSlackFields(error: ZodError): Record<string, string | undefined> {
  const fieldMap: Record<string, string> = {
    githubToken: 'github_token_block',
    repoUrl: 'repo_url_block',
    anthropicKey: 'anthropic_key_block',
    firecrawlKey: 'firecrawl_key_block',
  };

  const errors: Record<string, string | undefined> = {
    github_token_block: undefined,
    repo_url_block: undefined,
    anthropic_key_block: undefined,
    firecrawl_key_block: undefined,
  };

  error.issues.forEach((issue) => {
    const fieldPath = issue.path[0] as string;
    const slackField = fieldMap[fieldPath];
    if (slackField) {
      errors[slackField] = issue.message;
    }
  });

  return errors;
}
