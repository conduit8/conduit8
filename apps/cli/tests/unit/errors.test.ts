import { describe, expect, it } from 'vitest';

import {
  ApiUnavailableError,
  CliError,
  FileSystemError,
  InvalidSkillError,
  NetworkError,
  SkillAlreadyInstalledError,
  SkillNotFoundError,
  SkillNotInstalledError,
} from '../../src/utils/errors';

describe('error Classes', () => {
  describe('cliError', () => {
    it('should create error with message and code', () => {
      const error = new CliError('test message', 'TEST_CODE');
      expect(error.message).toBe('test message');
      expect(error.code).toBe('TEST_CODE');
      expect(error.name).toBe('CliError');
    });

    it('should be instanceof Error', () => {
      const error = new CliError('test', 'CODE');
      expect(error).toBeInstanceOf(Error);
      expect(error).toBeInstanceOf(CliError);
    });
  });

  describe('skillNotFoundError', () => {
    it('should format message with slug', () => {
      const error = new SkillNotFoundError('test-skill');
      expect(error.message).toBe('Skill \'test-skill\' not found in registry');
      expect(error.code).toBe('SKILL_NOT_FOUND');
    });
  });

  describe('skillAlreadyInstalledError', () => {
    it('should include slug and install path', () => {
      const error = new SkillAlreadyInstalledError('pdf', '/path/to/skills');
      expect(error.message).toContain('pdf');
      expect(error.message).toContain('/path/to/skills');
      expect(error.installPath).toBe('/path/to/skills');
      expect(error.code).toBe('SKILL_ALREADY_INSTALLED');
    });
  });

  describe('skillNotInstalledError', () => {
    it('should format message correctly', () => {
      const error = new SkillNotInstalledError('xlsx');
      expect(error.message).toBe('Skill \'xlsx\' is not installed');
      expect(error.code).toBe('SKILL_NOT_INSTALLED');
    });
  });

  describe('networkError', () => {
    it('should store status code', () => {
      const error = new NetworkError('Connection failed', 500);
      expect(error.message).toBe('Connection failed');
      expect(error.statusCode).toBe(500);
      expect(error.code).toBe('NETWORK_ERROR');
    });

    it('should work without status code', () => {
      const error = new NetworkError('Timeout');
      expect(error.statusCode).toBeUndefined();
    });
  });

  describe('fileSystemError', () => {
    it('should store operation type', () => {
      const error = new FileSystemError('Download failed', 'download');
      expect(error.operation).toBe('download');
      expect(error.code).toBe('FILESYSTEM_ERROR');
    });

    it('should support all operation types', () => {
      const operations = ['download', 'extract', 'validate', 'remove', 'read'] as const;
      operations.forEach((op) => {
        const error = new FileSystemError('test', op);
        expect(error.operation).toBe(op);
      });
    });
  });

  describe('invalidSkillError', () => {
    it('should have correct code', () => {
      const error = new InvalidSkillError('Missing SKILL.md');
      expect(error.message).toBe('Missing SKILL.md');
      expect(error.code).toBe('INVALID_SKILL');
    });
  });

  describe('apiUnavailableError', () => {
    it('should have default message', () => {
      const error = new ApiUnavailableError();
      expect(error.message).toContain('Unable to connect');
      expect(error.code).toBe('API_UNAVAILABLE');
    });
  });
});
