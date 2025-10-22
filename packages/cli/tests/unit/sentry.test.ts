import { describe, expect, it } from 'vitest';

import { addBreadcrumb, isSentryEnabled } from '../../src/utils/sentry';

describe('sentry Utils', () => {
  describe('addBreadcrumb', () => {
    it('should not throw when called', () => {
      expect(() => addBreadcrumb('test')).not.toThrow();
    });

    it('should accept data object', () => {
      expect(() => addBreadcrumb('test', { key: 'value' })).not.toThrow();
    });

    it('should handle undefined data', () => {
      expect(() => addBreadcrumb('test', undefined)).not.toThrow();
    });
  });

  describe('isSentryEnabled', () => {
    it('should return boolean', () => {
      const result = isSentryEnabled();
      expect(typeof result).toBe('boolean');
    });

    it('should not throw', () => {
      expect(() => isSentryEnabled()).not.toThrow();
    });
  });
});
