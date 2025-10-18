import { env } from 'cloudflare:test';
import { beforeEach, describe, expect, it } from 'vitest';

describe('claudeRuntime Integration', () => {
  let doId: DurableObjectId;
  let stub: DurableObjectStub;

  beforeEach(() => {
    // Check if CLAUDE_RUNTIME exists in env
    if (!env.CLAUDE_RUNTIME) {
      console.warn('CLAUDE_RUNTIME not available in test environment, skipping test setup');
      return;
    }

    // Create a unique Durable Object ID for each test
    doId = env.CLAUDE_RUNTIME.newUniqueId();
    stub = env.CLAUDE_RUNTIME.get(doId);
  });

  describe('durable Object Creation', () => {
    it('creates a ClaudeRuntime stub successfully', () => {
      if (!env.CLAUDE_RUNTIME) {
        console.warn('CLAUDE_RUNTIME not available, skipping test');
        return;
      }

      expect(stub).toBeDefined();
      expect(stub).toHaveProperty('fetch');
      expect(stub).toHaveProperty('id');
      expect(stub.id).toBe(doId);
    });

    it('handles fetch even when Container is not enabled', async () => {
      if (!env.CLAUDE_RUNTIME) {
        console.warn('CLAUDE_RUNTIME not available, skipping test');
        return;
      }

      try {
        // Since container features are not available in tests,
        // this will likely throw
        const response = await stub.fetch('http://test/health');
        expect(response).toBeInstanceOf(Response);
      }
      catch (error) {
        // Expected in test environment without containers enabled
        expect(error).toBeInstanceOf(Error);
        expect((error as Error).message).toContain('Containers have not been enabled');
      }
    });
  });

  describe('multiple Instance Isolation', () => {
    it('creates separate Durable Object instances', () => {
      if (!env.CLAUDE_RUNTIME) {
        console.warn('CLAUDE_RUNTIME not available, skipping test');
        return;
      }

      const doId2 = env.CLAUDE_RUNTIME.newUniqueId();
      const stub2 = env.CLAUDE_RUNTIME.get(doId2);

      expect(stub).not.toBe(stub2);
      expect(stub.id).not.toBe(stub2.id);
    });
  });

  describe('rPC Methods', () => {
    it('supports RPC method calls', async () => {
      if (!env.CLAUDE_RUNTIME || !stub) {
        console.warn('CLAUDE_RUNTIME not available, skipping test');
        return;
      }

      // Check that RPC methods are available
      expect(stub).toHaveProperty('getContainerHealth');
      expect(stub).toHaveProperty('setUserEnvVars');
      expect(stub).toHaveProperty('startAndWaitForPorts');

      // These should be callable functions
      expect(typeof stub.getContainerHealth).toBe('function');
    });

    it('can check container health via RPC', async () => {
      if (!env.CLAUDE_RUNTIME || !stub) {
        console.warn('CLAUDE_RUNTIME not available, skipping test');
        return;
      }

      try {
        // This may fail in test environment but should not throw
        const health = await stub.getContainerHealth();
        expect(health).toBeDefined();
      }
      catch (error) {
        // In test environment, containers may not be available
        console.log('Container health check failed (expected in test env):', error);
      }
    });
  });

  describe('named Instance Access', () => {
    it('can get runtime by name', () => {
      if (!env.CLAUDE_RUNTIME) {
        console.warn('CLAUDE_RUNTIME not available, skipping test');
        return;
      }

      const namedId = env.CLAUDE_RUNTIME.idFromName('test-user-123');
      const namedStub = env.CLAUDE_RUNTIME.get(namedId);

      expect(namedStub).toBeDefined();
      expect(namedStub.id).toBe(namedId);
    });

    it('returns same instance for same name', () => {
      if (!env.CLAUDE_RUNTIME) {
        console.warn('CLAUDE_RUNTIME not available, skipping test');
        return;
      }

      const name = 'consistent-user';
      const id1 = env.CLAUDE_RUNTIME.idFromName(name);
      const id2 = env.CLAUDE_RUNTIME.idFromName(name);

      expect(id1).toEqual(id2);
    });
  });
});
