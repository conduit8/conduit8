import { describe, expect, it } from 'vitest';

import {
  domainMessageSchema,
  queueMessageSchema,
} from '../../src/contracts/queue/queue-wrapper';

describe('queue-wrapper', () => {
  describe('critical paths', () => {
    it('validates wrapped command messages', () => {
      const commands = [
        { type: 'command' as const, name: 'SendMagicLink', email: 'test@example.com', magicLinkUrl: 'https://example.com', token: 'token123' },
        { type: 'command' as const, name: 'TrackUserSignup', userId: 'user-123' },
      ];

      commands.forEach((payload) => {
        const message = {
          version: 1,
          timestamp: '2024-01-01T00:00:00Z',
          payload,
        };
        const result = queueMessageSchema.safeParse(message);
        expect(result.success).toBe(true, `Failed for ${payload.name}`);
      });
    });

    it('validates wrapped event messages', () => {
      const events = [
        { type: 'event' as const, name: 'SubscriptionPurchased', id: crypto.randomUUID(), timestamp: '2024-01-01T00:00:00Z', userId: 'user-123', amountCents: 999, currency: 'USD', planType: 'monthly' },
        { type: 'event' as const, name: 'TranscriptionCompleted', id: crypto.randomUUID(), timestamp: '2024-01-01T00:00:00Z', status: 'success', jobId: 'job-123', userId: 'user-123' },
        { type: 'event' as const, name: 'TranscriptDeleted', id: crypto.randomUUID(), timestamp: '2024-01-01T00:00:00Z', transcriptId: 'tx-123', userId: 'user-123', rawKey: 'raw.mp3' },
      ];

      events.forEach((event) => {
        const message = {
          version: 1,
          timestamp: '2024-01-01T00:00:00Z',
          payload: event,
        };
        const result = queueMessageSchema.safeParse(message);
        if (!result.success) {
          console.log(`Failed for ${event.name}:`, result.error.issues);
        }
        expect(result.success).toBe(true, `Failed for ${event.name}`);
      });
    });

    it('transforms R2 events to wrapped format', () => {
      const r2Event = {
        account: 'abc123',
        action: 'PutObject',
        bucket: 'my-bucket',
        object: {
          key: 'uploads/file.mp3',
          size: 1024,
          eTag: 'abc123',
        },
        eventTime: '2024-01-01T00:00:00Z',
      };

      const result = queueMessageSchema.safeParse(r2Event);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.version).toBe(1);
        expect(result.data.timestamp).toBe(r2Event.eventTime);
        expect(result.data.payload.name).toBe('r2:PutObject');
      }
    });

    it('rejects invalid messages', () => {
      const invalidMessage = {
        version: 1,
        timestamp: '2024-01-01T00:00:00Z',
        payload: {
          type: 'invalid',
          name: 'Unknown',
        },
      };

      const result = queueMessageSchema.safeParse(invalidMessage);
      expect(result.success).toBe(false);
    });

    it('identifies messages by discriminator', () => {
      const command = {
        type: 'command',
        name: 'SendMagicLink',
        email: 'test@example.com',
        magicLinkUrl: 'https://example.com/auth',
        token: 'token123',
      };

      const result = domainMessageSchema.safeParse(command);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.name).toBe('SendMagicLink');
      }
    });
  });
});
