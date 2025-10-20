import type { ZodError } from 'zod';

import { BaseError } from './base.errors';

// Domain Errors == Business Rules Errors
export abstract class DomainError extends BaseError {}

// Auth Flow domain errors
export class AuthFlowError extends DomainError {
  public readonly cause?: unknown;
  public readonly code?: string;

  constructor(userMessage: string, opts?: { cause?: unknown; code?: string }) {
    super(userMessage, opts?.cause ? { cause: opts.cause } : undefined);
    this.cause = opts?.cause;
    this.code = opts?.code;

    // Preserve original error cause chain
    if (opts?.cause instanceof Error) {
      this.stack = opts.cause.stack;
    }
  }
}

// Workspace Installation domain errors
export class WorkspaceInstallationValidationError extends DomainError {
  constructor(
    message: string,
    public readonly field?: string,
  ) {
    super(message);
  }
}

export class WorkspaceAlreadyInstalledError extends DomainError {
  constructor(teamId: string) {
    super(`Workspace ${teamId} is already installed`);
  }
}

export class WorkspaceNotFoundError extends DomainError {
  constructor(teamId: string) {
    super(`Workspace ${teamId} not found`);
  }
}

// User Config domain errors
export class ValidationError extends DomainError {
  constructor(
    message: string,
    public readonly field?: string,
    public readonly zodError?: ZodError,
  ) {
    super(message);
  }
}

// User Service domain errors
export class UserServiceError extends DomainError {
  constructor(
    message: string,
    public readonly cause?: unknown,
  ) {
    super(message, { cause });
  }
}

// Slack OAuth domain errors
export class SlackOAuthTokenExchangeError extends DomainError {
  constructor(
    message: string,
    public readonly slackError?: string,
  ) {
    super(message);
  }
}

// Skill domain errors
export class SkillNotFoundError extends DomainError {
  constructor(slug: string) {
    super(`Skill '${slug}' not found`);
  }
}
