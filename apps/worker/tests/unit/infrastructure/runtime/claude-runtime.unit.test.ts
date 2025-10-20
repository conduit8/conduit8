import { ClaudeRuntime } from '@worker/infrastructure/runtime/claude-runtime';
import { describe, expect, it, vi } from 'vitest';

/**
 * Unit tests for ClaudeRuntime configuration and methods
 * Note: Container instantiation requires runtime environment,
 * so we test the class definition and method behavior
 */
describe('claudeRuntime', () => {
  it('has correct container configuration', () => {
    expect(ClaudeRuntime).toBeDefined();
    expect(ClaudeRuntime.prototype).toHaveProperty('onStart');
    expect(ClaudeRuntime.prototype).toHaveProperty('onStop');
    expect(ClaudeRuntime.prototype).toHaveProperty('onError');
    expect(ClaudeRuntime.prototype).toHaveProperty('fetch');
  });

  describe('container lifecycle', () => {
    it('extends Container class', () => {
      // Since we cannot import Container in unit tests,
      // we check for expected Container methods
      const proto = ClaudeRuntime.prototype;
      const containerMethods = [
        'onStart',
        'onStop',
        'onError',
        'getContainerHealth',
        'persistEnvVars',
        'startAndWaitForPorts',
      ];

      // Check that these methods are either defined or will be inherited
      containerMethods.forEach((method) => {
        // Methods can be on the prototype or inherited from Container
        const hasMethod = method in proto || Object.prototype.hasOwnProperty.call(proto, method);
        expect(hasMethod || proto[method as keyof typeof proto]).toBeDefined();
      });
    });
  });

  describe('runtime methods', () => {
    it('defines required lifecycle hooks', () => {
      // Since Container requires a proper DurableObjectState in unit tests,
      // we test the prototype instead of instantiating
      const proto = ClaudeRuntime.prototype;

      expect(proto.onStart).toBeDefined();
      expect(proto.onStop).toBeDefined();
      expect(proto.onError).toBeDefined();
      expect(proto.fetch).toBeDefined();

      expect(typeof proto.onStart).toBe('function');
      expect(typeof proto.onStop).toBe('function');
      expect(typeof proto.onError).toBe('function');
      expect(typeof proto.fetch).toBe('function');
    });
  });
});
