import { describe, expect, it } from 'vitest';

import { flushPostHog, initPostHog, isPostHogEnabled, trackEvent } from '../../src/utils/analytics';

describe('analytics Utils', () => {
  describe('initPostHog', () => {
    it('should not throw when telemetry enabled', () => {
      expect(() => initPostHog(true)).not.toThrow();
    });

    it('should not throw when telemetry disabled', () => {
      expect(() => initPostHog(false)).not.toThrow();
    });

    it('should not throw with default parameter', () => {
      expect(() => initPostHog()).not.toThrow();
    });
  });

  describe('isPostHogEnabled', () => {
    it('should return boolean', () => {
      const result = isPostHogEnabled();
      expect(typeof result).toBe('boolean');
    });

    it('should not throw', () => {
      expect(() => isPostHogEnabled()).not.toThrow();
    });
  });

  describe('trackEvent', () => {
    it('should not throw when called', () => {
      expect(() => trackEvent('test_event')).not.toThrow();
    });

    it('should accept properties object', () => {
      expect(() => trackEvent('test_event', { key: 'value' })).not.toThrow();
    });

    it('should handle undefined properties', () => {
      expect(() => trackEvent('test_event', undefined)).not.toThrow();
    });

    it('should handle complex properties', () => {
      expect(() => trackEvent('test_event', {
        string: 'value',
        number: 123,
        boolean: true,
        nested: { key: 'value' },
      })).not.toThrow();
    });

    it('should not block (execute synchronously)', () => {
      const start = Date.now();
      trackEvent('test_event', { test: true });
      const duration = Date.now() - start;

      // Should complete in less than 10ms (non-blocking)
      expect(duration).toBeLessThan(10);
    });
  });

  describe('flushPostHog', () => {
    it('should not throw', async () => {
      await expect(flushPostHog()).resolves.not.toThrow();
    });

    it('should return promise', () => {
      const result = flushPostHog();
      expect(result).toBeInstanceOf(Promise);
    });
  });

  describe('--no-telemetry flag behavior', () => {
    it('should safely handle tracking when telemetry disabled', () => {
      // Initialize with telemetry disabled
      initPostHog(false);

      // All tracking functions should still work without throwing
      expect(() => trackEvent('test_event')).not.toThrow();
      expect(() => flushPostHog()).not.toThrow();
    });
  });
});
