/**
 * Custom error classes for better error handling and user messaging
 */

/**
 * Base class for all CLI errors
 */
export class CliError extends Error {
  constructor(
    message: string,
    public readonly code: string,
  ) {
    super(message);
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * Skill not found in registry
 */
export class SkillNotFoundError extends CliError {
  constructor(slug: string) {
    super(
      `Skill '${slug}' not found in registry`,
      'SKILL_NOT_FOUND',
    );
  }
}

/**
 * Skill already installed
 */
export class SkillAlreadyInstalledError extends CliError {
  constructor(
    slug: string,
    public readonly installPath: string,
  ) {
    super(
      `Skill '${slug}' is already installed in ${installPath}`,
      'SKILL_ALREADY_INSTALLED',
    );
  }
}

/**
 * Skill not installed locally
 */
export class SkillNotInstalledError extends CliError {
  constructor(slug: string) {
    super(
      `Skill '${slug}' is not installed`,
      'SKILL_NOT_INSTALLED',
    );
  }
}

/**
 * Network or API errors
 */
export class NetworkError extends CliError {
  constructor(
    message: string,
    public readonly statusCode?: number,
  ) {
    super(message, 'NETWORK_ERROR');
  }
}

/**
 * File system errors (download, extract, validate)
 */
export class FileSystemError extends CliError {
  constructor(
    message: string,
    public readonly operation: 'download' | 'extract' | 'validate' | 'remove' | 'read',
  ) {
    super(message, 'FILESYSTEM_ERROR');
  }
}

/**
 * Invalid skill package (missing SKILL.md, corrupted ZIP, etc.)
 */
export class InvalidSkillError extends CliError {
  constructor(message: string) {
    super(message, 'INVALID_SKILL');
  }
}

/**
 * API is unavailable (offline mode)
 */
export class ApiUnavailableError extends CliError {
  constructor() {
    super(
      'Unable to connect to conduit8 API. Check your internet connection.',
      'API_UNAVAILABLE',
    );
  }
}
