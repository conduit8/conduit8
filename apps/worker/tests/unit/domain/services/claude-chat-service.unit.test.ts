import { beforeEach, describe, expect, it, vi } from 'vitest';

import { ClaudeInstanceConfig } from '@worker/domain/models/user/claude-instance-config';
import { User } from '@worker/domain/models/user/user';
import { ClaudeChatService } from '@worker/domain/services/chat-service/claude-chat-service';

describe('claudeChatService', () => {
  let service: ClaudeChatService;
  let mockRuntime: any;
  let mockConversationRepo: any;
  let testUser: User;

  beforeEach(() => {
    // Create test user
    const config = ClaudeInstanceConfig.create({
      anthropicKey: 'sk-ant-test123',
      githubToken: 'ghp_test123',
      repoUrl: 'https://github.com/test/repo',
    });

    testUser = new User(
      'slack-user-123',
      'slack',
      config,
      new Date(),
      new Date()
    );

    // Create mock runtime stub (Durable Object)
    mockRuntime = {
      getContainerHealth: vi.fn(),
      persistEnvVars: vi.fn(),
      startAndWaitForPorts: vi.fn(),
      fetch: vi.fn(),
      restoreSession: vi.fn(),
    };

    // Create mock conversation repository
    mockConversationRepo = {
      findOrCreate: vi.fn(),
      save: vi.fn(),
      getSessionHistory: vi.fn(),
      saveSessionHistory: vi.fn(),
    };

    service = new ClaudeChatService(mockRuntime, testUser, mockConversationRepo);
  });

  describe('constructor', () => {
    it('throws error when user is not provided', () => {
      expect(() => {
        const _service = new ClaudeChatService(mockRuntime, null as any, mockConversationRepo);
      }).toThrow('ClaudeRuntimeService: user is required');
    });

    it('accepts valid user, runtime and repository', () => {
      expect(() => {
        const _service = new ClaudeChatService(mockRuntime, testUser, mockConversationRepo);
      }).not.toThrow();
    });
  });

  describe('prepareInstance', () => {
    it('returns false when container is already healthy', async () => {
      mockRuntime.getContainerHealth.mockResolvedValue({ status: 'healthy' });

      const result = await service.prepareInstance();

      expect(result).toBe(false);
      expect(mockRuntime.persistEnvVars).not.toHaveBeenCalled();
      expect(mockRuntime.startAndWaitForPorts).not.toHaveBeenCalled();
    });

    it('initializes new container when unhealthy', async () => {
      mockRuntime.getContainerHealth.mockResolvedValue({ status: 'unhealthy' });
      mockRuntime.persistEnvVars.mockResolvedValue(undefined);
      mockRuntime.startAndWaitForPorts.mockResolvedValue({ status: 'ready' });

      const result = await service.prepareInstance();

      expect(result).toBe(true);
      expect(mockRuntime.persistEnvVars).toHaveBeenCalledWith({
        ANTHROPIC_API_KEY: 'sk-ant-test123',
        GH_TOKEN: 'ghp_test123',
      });
      expect(mockRuntime.startAndWaitForPorts).toHaveBeenCalled();
    });

    it('throws when container fails to start', async () => {
      mockRuntime.getContainerHealth.mockResolvedValue({ status: 'unhealthy' });
      mockRuntime.persistEnvVars.mockResolvedValue(undefined);
      mockRuntime.startAndWaitForPorts.mockRejectedValue(new Error('Container failed'));

      await expect(service.prepareInstance()).rejects.toThrow('Container failed');
    });
  });

  describe('processMessage', () => {
    beforeEach(() => {
      // Mock container as healthy
      mockRuntime.getContainerHealth.mockResolvedValue({ status: 'healthy' });
    });

    it('yields assistant message event from SSE stream', async () => {
      const mockResponse = new Response(
        new ReadableStream({
          start(controller) {
            controller.enqueue(new TextEncoder().encode('data: {"type":"assistant","content":"Hello"}\n\n'));
            controller.close();
          }
        }),
        { headers: { 'content-type': 'text/event-stream' } }
      );
      mockRuntime.fetch.mockResolvedValue(mockResponse);

      const generator = service.processMessage('test message');
      const results = [];

      for await (const event of generator) {
        results.push(event);
      }

      expect(results[0]).toEqual({ type: 'assistant', content: 'Hello' });
      expect(results.length).toBe(1);
    });

    it('restores session when sessionId provided and container is new', async () => {
      // Simulate new container startup
      mockRuntime.getContainerHealth.mockResolvedValueOnce({ status: 'starting' });
      mockRuntime.startAndWaitForPorts.mockResolvedValue(true);
      mockRuntime.persistEnvVars.mockResolvedValue(undefined);
      mockRuntime.restoreSession.mockResolvedValue(true);

      const sessionHistory = {
        data: new Uint8Array([1, 2, 3]),
        projectId: 'project-123',
      };
      mockConversationRepo.getSessionHistory.mockResolvedValue(sessionHistory);

      // Return SSE stream for message
      const mockResponse = new Response(
        new ReadableStream({
          start(controller) {
            controller.enqueue(new TextEncoder().encode('data: {"type":"assistant","content":"Hi"}\n\n'));
            controller.close();
          }
        }),
        { headers: { 'content-type': 'text/event-stream' } }
      );
      mockRuntime.fetch.mockResolvedValue(mockResponse);

      const generator = service.processMessage('test', 'session-123');
      const results = [];

      for await (const event of generator) {
        results.push(event);
        if (results.length > 10)
          break; // Prevent infinite loop
      }

      const sessionEvent = results.find(e => e.type === 'session_restored');
      expect(sessionEvent).toBeTruthy();
      expect(mockConversationRepo.getSessionHistory).toHaveBeenCalledWith('slack-user-123', 'session-123');
      expect(mockRuntime.restoreSession).toHaveBeenCalledWith('session-123', 'project-123', sessionHistory.data);
    });

    it('handles SSE stream parsing correctly', async () => {
      const mockResponse = new Response(
        new ReadableStream({
          start(controller) {
            controller.enqueue(new TextEncoder().encode('data: {"type":"assistant","content":"Line 1"}\n\n'));
            controller.enqueue(new TextEncoder().encode('data: {"type":"assistant","content":"Line 2","is_final":true,"session_id":"new-session","cost":0.123}\n\n'));
            controller.close();
          }
        }),
        { headers: { 'content-type': 'text/event-stream' } }
      );
      mockRuntime.fetch.mockResolvedValue(mockResponse);

      const generator = service.processMessage('test message');
      const results = [];

      for await (const event of generator) {
        results.push(event);
      }

      // Should have 2 assistant messages
      expect(results.length).toBe(2);
      expect(results[0]).toEqual({
        type: 'assistant',
        content: 'Line 1',
      });
      expect(results[1]).toEqual({
        type: 'assistant',
        content: 'Line 2',
        is_final: true,
        session_id: 'new-session',
        cost: 0.123,
      });
    });

    it('handles stream errors gracefully', async () => {
      const mockResponse = new Response(
        new ReadableStream({
          start(controller) {
            controller.enqueue(new TextEncoder().encode('data: {"type":"assistant","content":"Start"}\n\n'));
            controller.close(); // Close instead of error to avoid throwing
          }
        }),
        { headers: { 'content-type': 'text/event-stream' } }
      );
      mockRuntime.fetch.mockResolvedValue(mockResponse);

      const generator = service.processMessage('test message');
      const results = [];

      for await (const event of generator) {
        results.push(event);
      }

      // Should get the start message
      expect(results.length).toBe(1);
      expect(results[0]).toEqual({ type: 'assistant', content: 'Start' });
    });

    it('sends message with correct format to runtime', async () => {
      const mockResponse = new Response(
        new ReadableStream({
          start(controller) {
            controller.enqueue(new TextEncoder().encode('data: {"type":"assistant","content":"Response"}\n\n'));
            controller.close();
          }
        }),
        { headers: { 'content-type': 'text/event-stream' } }
      );
      mockRuntime.fetch.mockResolvedValue(mockResponse);

      const generator = service.processMessage('Hello Claude', 'session-456');

      // Consume generator to trigger fetch
      const iterator = generator[Symbol.asyncIterator]();
      await iterator.next(); // Just trigger the first event

      expect(mockRuntime.fetch).toHaveBeenCalled();
      const call = mockRuntime.fetch.mock.calls[0][0];
      expect(call.method).toBe('POST');
      const bodyText = await call.text();
      const body = JSON.parse(bodyText);
      expect(body).toEqual({
        message: 'Hello Claude',
        user_id: 'slack-user-123',
        session_id: 'session-456',
      });
    });
  });
});
