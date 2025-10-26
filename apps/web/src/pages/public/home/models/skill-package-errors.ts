/**
 * Base error for skill package parsing failures
 */
export abstract class SkillPackageError extends Error {
  abstract readonly code: string;

  constructor(message: string) {
    super(message);
    this.name = this.constructor.name;
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

/**
 * ZIP file exceeds maximum allowed size
 */
export class FileTooLargeError extends SkillPackageError {
  readonly code = 'file_too_large';

  constructor(actualSizeMB: number, maxSizeMB: number) {
    super(`ZIP file too large (${actualSizeMB}MB). Maximum ${maxSizeMB}MB allowed.`);
  }
}

/**
 * ZIP file missing required SKILL.md file
 */
export class MissingSkillMdError extends SkillPackageError {
  readonly code = 'missing_skill_md';

  constructor() {
    super('ZIP must contain exactly one SKILL.md file.');
  }
}

/**
 * Multiple SKILL.md files found in ZIP
 */
export class MultipleSkillMdError extends SkillPackageError {
  readonly code = 'missing_skill_md';

  constructor(count: number, files: string[]) {
    super(`ZIP must contain exactly one SKILL.md file. Found ${count}: ${files.join(', ')}`);
  }
}

/**
 * SKILL.md frontmatter validation failed
 */
export class InvalidFrontmatterError extends SkillPackageError {
  readonly code = 'invalid_frontmatter';

  constructor(message: string) {
    super(`Invalid SKILL.md frontmatter: ${message}`);
  }
}

/**
 * ZIP contains too many files
 */
export class TooManyFilesError extends SkillPackageError {
  readonly code = 'too_many_files';

  constructor(actualCount: number, maxCount: number) {
    super(`ZIP contains too many files. Maximum ${maxCount} files allowed, found ${actualCount}.`);
  }
}

/**
 * ZIP contains nested archive files (security)
 */
export class NestedArchiveError extends SkillPackageError {
  readonly code = 'nested_archives';

  constructor(filePath: string) {
    super(`Nested archive files are not allowed: ${filePath}`);
  }
}

/**
 * Generic parsing error for unexpected failures
 */
export class ParseError extends SkillPackageError {
  readonly code = 'parse_error';

  constructor(message: string = 'Failed to parse ZIP file') {
    super(message);
  }
}
