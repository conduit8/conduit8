import { BaseError } from './base.errors';

// Infrastructure Layer Error
abstract class InfrastructureError extends BaseError {}

// Validation error for boundary/input validation
export class WorkspaceValidationError extends InfrastructureError {
  constructor(
    message: string,
    public readonly errors: Record<string, string>,
  ) {
    const errorDetails = Object.entries(errors)
      .map(([field, error]) => `${field}: ${error}`)
      .join(', ');

    super(`${message} - ${errorDetails}`);
    this.name = 'ValidationError';
  }
}

// Database errors - minimal but useful
export class DatabaseError extends InfrastructureError {
  constructor(
    message: string,
    public readonly cause?: unknown,
  ) {
    super(message);
  }
}

export class DatabaseIntegrityError extends DatabaseError {
  constructor(message: string, cause?: unknown) {
    super(message, cause);
  }
}

export class DatabaseConnectionError extends DatabaseError {
  constructor(message: string, cause?: unknown) {
    super(message, cause);
  }
}

export class DatabaseTimeoutError extends DatabaseError {
  constructor(message: string, cause?: unknown) {
    super(message, cause);
  }
}

// Storage errors (KV + D1)
export class StorageError extends InfrastructureError {
  constructor(
    message: string,
    public readonly operation?: 'read' | 'write' | 'delete',
    public readonly storageType?: 'KV' | 'D1',
    public readonly originalCause?: Error,
  ) {
    super(message);
  }
}

// Specific bucket failures
export class StorageUnavailableError extends StorageError {
  constructor(storageType: 'KV' | 'D1', operation: string) {
    super(`${storageType} storage unavailable during ${operation}`, operation as any, storageType);
  }
}

// Email service errors
export class EmailServiceError extends InfrastructureError {
  constructor(
    message: string,
    public readonly operation?: 'send' | 'configuration',
    public readonly provider?: string,
    public readonly originalCause?: Error,
  ) {
    super(message);
  }
}

export class StorageSerializationError extends StorageError {
  constructor(message: string, _data?: any) {
    super(`Serialization error: ${message}`, 'write');
  }
}

/**
 * Error thrown when container startup fails
 * Distinguishes infrastructure startup errors from runtime errors
 */
export class ContainerStartupError extends InfrastructureError {
  constructor(message: string, public readonly statusCode?: number) {
    super(message);
    this.name = 'ContainerStartupError';
  }
}

/**
 * Error thrown when Modal services operations fail
 * Tracks whether error is transient (can retry) or permanent
 */
export class SandboxError extends InfrastructureError {
  constructor(
    message: string,
    public readonly isTransient: boolean = false,
    public readonly originalError?: Error,
  ) {
    super(message);
    this.name = 'SandboxError';
  }
}

/**
 * Error thrown when Slack interaction payload parsing fails
 * Used for missing payload or invalid JSON in interaction requests
 */
export class SlackInteractionParseError extends InfrastructureError {
  constructor(
    message: string,
    public readonly errorType: 'missing_payload' | 'invalid_json',
    public readonly originalError?: Error,
  ) {
    super(message);
  }
}

export class SlackClientError extends InfrastructureError {
  constructor(
    message: string,
    public readonly originalError?: Error,
  ) {
    super(message);
  }
}
