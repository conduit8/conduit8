import { WebClient } from '@slack/web-api';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { SlackMessagingService } from '@worker/domain/services/messaging/slack-messaging-service';

/**
 * SlackMessagingService Unit Tests
 * Tests for Slack messaging service focusing on correct terminology and message consistency
 */
describe('slackMessagingService', () => {
  let service: SlackMessagingService;
  let mockWebClient: any;

  beforeEach(() => {
    mockWebClient = {
      chat: {
        postMessage: vi.fn().mockResolvedValue({ ok: true, ts: '123.456' }),
        update: vi.fn().mockResolvedValue({ ok: true }),
      },
      assistant: {
        threads: {
          setStatus: vi.fn().mockResolvedValue({ ok: true }),
        },
      },
      views: {
        open: vi.fn().mockResolvedValue({ ok: true }),
        publish: vi.fn().mockResolvedValue({ ok: true }),
      },
      conversations: {
        open: vi.fn().mockResolvedValue({ ok: true, channel: { id: 'DM123' } }),
      },
    };

    // Create service with mocked WebClient
    service = new SlackMessagingService(mockWebClient as any);
  });

  describe('sendThreadStartedMessage', () => {
    it('should send configuration message when user is not configured', async () => {
      await service.sendThreadStartedMessage(false, 'U123', 'C456', 'thread.123');

      expect(mockWebClient.chat.postMessage).toHaveBeenCalledWith(
        expect.objectContaining({
          channel: 'C456',
          text: '🔧 Kollektiv needs configuration to continue.',
          thread_ts: 'thread.123',
        }),
      );
    });

    it('should send welcome message when user is configured', async () => {
      await service.sendThreadStartedMessage(true, 'U123', 'C456', 'thread.123');

      expect(mockWebClient.chat.postMessage).toHaveBeenCalledWith(
        expect.objectContaining({
          channel: 'C456',
          text: 'Welcome to Kollektiv',
          thread_ts: 'thread.123',
        }),
      );
    });
  });

  describe('sendConfigSuccessMessage', () => {
    it('should send success message to channel', async () => {
      await service.sendConfigSuccessMessage('U123', 'C456');

      expect(mockWebClient.chat.postMessage).toHaveBeenCalledWith(
        expect.objectContaining({
          channel: 'C456',
          text: '✅ Configuration saved! Send any message to start your Kollektiv bot instance.',
        }),
      );
    });

    it('should open DM and send message when no channel provided', async () => {
      await service.sendConfigSuccessMessage('U123');

      expect(mockWebClient.conversations.open).toHaveBeenCalledWith({ users: 'U123' });
      expect(mockWebClient.chat.postMessage).toHaveBeenCalledWith(
        expect.objectContaining({
          channel: 'DM123',
          text: '✅ Configuration saved! Send any message to start your Kollektiv bot instance.',
        }),
      );
    });
  });

  describe('postMessage', () => {
    it('should post message without blocks', async () => {
      const result = await service.postMessage('C456', 'Test message');

      expect(mockWebClient.chat.postMessage).toHaveBeenCalledWith({
        channel: 'C456',
        text: 'Test message',
        blocks: undefined,
        thread_ts: undefined,
      });
      expect(result).toBe('123.456');
    });

    it('should handle errors gracefully', async () => {
      mockWebClient.chat.postMessage.mockRejectedValueOnce(new Error('API error'));

      const result = await service.postMessage('C456', 'Test message');

      expect(result).toBeUndefined();
    });
  });
});
