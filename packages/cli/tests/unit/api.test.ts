import { describe, expect, it } from 'vitest';

import {
  ApiUnavailableError,
  FileSystemError,
  InvalidSkillError,
  NetworkError,
  SkillNotFoundError,
} from '../../src/utils/errors';

describe('aPI Utils Integration', () => {
  describe('error type checks', () => {
    it('should identify SkillNotFoundError', () => {
      const error = new SkillNotFoundError('test');
      expect(error).toBeInstanceOf(SkillNotFoundError);
      expect(error.code).toBe('SKILL_NOT_FOUND');
    });

    it('should identify ApiUnavailableError', () => {
      const error = new ApiUnavailableError();
      expect(error).toBeInstanceOf(ApiUnavailableError);
      expect(error.code).toBe('API_UNAVAILABLE');
    });

    it('should identify NetworkError', () => {
      const error = new NetworkError('test', 500);
      expect(error).toBeInstanceOf(NetworkError);
      expect(error.statusCode).toBe(500);
    });
  });

  describe('fileSystemError operations', () => {
    it('should support download operation', () => {
      const error = new FileSystemError('Download failed', 'download');
      expect(error.operation).toBe('download');
    });

    it('should support extract operation', () => {
      const error = new FileSystemError('Extract failed', 'extract');
      expect(error.operation).toBe('extract');
    });

    it('should support validate operation', () => {
      const error = new FileSystemError('Validation failed', 'validate');
      expect(error.operation).toBe('validate');
    });
  });

  describe('invalidSkillError', () => {
    it('should have correct properties', () => {
      const error = new InvalidSkillError('Missing SKILL.md');
      expect(error.message).toBe('Missing SKILL.md');
      expect(error.code).toBe('INVALID_SKILL');
    });
  });
});
