import { posthog } from '@web/lib/clients';

import type { SkillPackageError } from '@web/pages/public/home/models/skill-package-errors';

/**
 * Error types for skill file parsing failures
 */
export type SkillParsingErrorType
  = | 'file_too_large'
    | 'missing_skill_md'
    | 'invalid_frontmatter'
    | 'too_many_files'
    | 'nested_archives'
    | 'parse_error';

/**
 * Map error to error type for analytics using error code
 * Robust - not dependent on error message wording
 */
export function getParsingErrorType(error: Error): SkillParsingErrorType {
  // Check if it's a typed SkillPackageError with a code property
  if ('code' in error) {
    const code = (error as SkillPackageError).code;
    if (code === 'file_too_large'
      || code === 'missing_skill_md'
      || code === 'invalid_frontmatter'
      || code === 'too_many_files'
      || code === 'nested_archives'
      || code === 'parse_error') {
      return code as SkillParsingErrorType;
    }
  }

  // Fallback for unexpected errors
  return 'parse_error';
}

/**
 * Track when skill submission dialog is opened
 */
export function trackSkillSubmissionDialogOpened() {
  posthog.capture('skill_submission_dialog_opened');
}

/**
 * Track successful file parsing
 */
export function trackSkillFileParsingSucceeded(fileSizeMB: number, fileCount: number) {
  posthog.capture('skill_file_parsing_succeeded', {
    file_size_mb: Number(fileSizeMB.toFixed(2)),
    file_count: fileCount,
  });
}

/**
 * Track file parsing failure
 */
export function trackSkillFileParsingFailed(errorType: SkillParsingErrorType, fileSizeMB?: number) {
  posthog.capture('skill_file_parsing_failed', {
    error_type: errorType,
    ...(fileSizeMB !== undefined && { file_size_mb: Number(fileSizeMB.toFixed(2)) }),
  });
}

/**
 * Track when skill name is unavailable
 */
export function trackSkillNameUnavailable(slug: string) {
  posthog.capture('skill_name_unavailable', {
    slug,
  });
}

/**
 * Track when all validations pass
 */
export function trackSkillValidationPassed() {
  posthog.capture('skill_validation_passed');
}

/**
 * Track category selection
 */
export function trackSkillCategorySelected(category: string) {
  posthog.capture('skill_category_selected', {
    category,
  });
}

/**
 * Track when submit button is clicked (entry point to submission flow)
 */
export function trackSubmitButtonClicked(isAuthenticated: boolean) {
  posthog.capture('submit_button_clicked', {
    is_authenticated: isAuthenticated,
  });
}

/**
 * Track submission start
 */
export function trackSkillSubmissionStarted(
  category: string,
  fileSizeMB: number,
  fileCount: number,
) {
  posthog.capture('skill_submission_started', {
    category,
    file_size_mb: Number(fileSizeMB.toFixed(2)),
    file_count: fileCount,
  });
}
