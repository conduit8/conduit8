import type { PlatformContext } from '@worker/domain/models/conversation/conversation';

import { Conversation } from '@worker/domain/models/conversation/conversation';
import { ConversationRepository } from '@worker/infrastructure/persistence/repositories/conversation-repository';
import { env } from 'cloudflare:test';
import { beforeEach, describe, expect, it } from 'vitest';

describe('conversationRepository Integration', () => {
  let repository: ConversationRepository;
  let testUserId: string;
  let testContext: PlatformContext;
  let testConversation: Conversation;

  beforeEach(() => {
    // Create fresh repository for each test
    repository = new ConversationRepository(
      env.KV,
      env.D1,
      env.R2
    );

    // Create unique test data for each test
    testUserId = `U${Date.now()}${Math.random()}`;
    testContext = {
      platform: 'slack',
      channel: `D${Date.now()}`,
      threadTs: `${Date.now()}.${Math.random()}`
    };
    testConversation = Conversation.startNew(testUserId, testContext);
  });

  describe('findByUserAndContext', () => {
    it('returns null for non-existent conversation', async () => {
      const result = await repository.findByUserAndContext(testUserId, testContext);
      expect(result).toBeNull();
    });

    it('finds saved conversation', async () => {
      await repository.save(testConversation);

      const result = await repository.findByUserAndContext(testUserId, testContext);

      expect(result).not.toBeNull();
      expect(result?.id).toBe(testConversation.id);
      expect(result?.platformUserId).toBe(testUserId);
      expect(result?.platformContext).toEqual(testContext);
    });

    it('returns null for different thread in same channel', async () => {
      await repository.save(testConversation);

      const differentThread = {
        ...testContext,
        threadTs: '9999999.999'
      };

      const result = await repository.findByUserAndContext(testUserId, differentThread);
      expect(result).toBeNull();
    });
  });

  describe('save', () => {
    it('saves new conversation', async () => {
      await repository.save(testConversation);

      const result = await repository.findByUserAndContext(testUserId, testContext);
      expect(result?.id).toBe(testConversation.id);
    });

    it('updates existing conversation with session ID', async () => {
      await repository.save(testConversation);

      // Use domain method to update conversation
      const updatedConversation = testConversation.completeTurn('session-123', 0.001);
      await repository.save(updatedConversation);

      const result = await repository.findByUserAndContext(testUserId, testContext);
      expect(result?.claudeSessionId).toBe('session-123');
    });

    it('handles concurrent saves of same conversation', async () => {
      const promises = Array.from({ length: 3 }).fill(null).map(() =>
        repository.save(testConversation)
      );

      await Promise.all(promises);

      const result = await repository.findByUserAndContext(testUserId, testContext);
      expect(result?.id).toBe(testConversation.id);
    });
  });

  describe('delete', () => {
    it('removes conversation completely', async () => {
      await repository.save(testConversation);
      await repository.deleteConversation(testConversation);

      const result = await repository.findByUserAndContext(testUserId, testContext);
      expect(result).toBeNull();
    });

    it('handles delete of non-existent conversation', async () => {
      // Should not throw
      await expect(repository.deleteConversation(testConversation)).resolves.not.toThrow();
    });
  });

  describe('session History Operations', () => {
    const testSessionId = 'session-test-123';
    const testProjectId = 'project-456';
    const testData = new TextEncoder().encode('test conversation history\nline 2\nline 3');

    it('saves and retrieves session history', async () => {
      await repository.saveSessionHistory(testUserId, testSessionId, testData, testProjectId);

      const result = await repository.getSessionHistory(testUserId, testSessionId);

      expect(result).not.toBeNull();
      expect(result?.projectId).toBe(testProjectId);
      expect(new TextDecoder().decode(result?.data)).toBe('test conversation history\nline 2\nline 3');
    });

    it('returns null for non-existent session', async () => {
      const result = await repository.getSessionHistory(testUserId, 'non-existent');
      expect(result).toBeNull();
    });

    it('deletes session history', async () => {
      await repository.saveSessionHistory(testUserId, testSessionId, testData, testProjectId);
      await repository.deleteSessionHistory(testUserId, testSessionId);

      const result = await repository.getSessionHistory(testUserId, testSessionId);
      expect(result).toBeNull();
    });

    it('overwrites existing session history', async () => {
      const originalData = new TextEncoder().encode('original data');
      const updatedData = new TextEncoder().encode('updated data');

      await repository.saveSessionHistory(testUserId, testSessionId, originalData, testProjectId);
      await repository.saveSessionHistory(testUserId, testSessionId, updatedData, 'new-project');

      const result = await repository.getSessionHistory(testUserId, testSessionId);
      expect(new TextDecoder().decode(result?.data)).toBe('updated data');
      expect(result?.projectId).toBe('new-project');
    });
  });

  describe('cross-storage consistency', () => {
    it('kV cache miss falls back to D1', async () => {
      // Save conversation
      await repository.save(testConversation);

      // Clear KV to force D1 fallback
      const lookupKey = `slack:${testUserId}:${testContext.threadTs}`;
      await env.KV.delete(`conversation:${lookupKey}`);

      // Should still find via D1
      const result = await repository.findByUserAndContext(testUserId, testContext);
      expect(result?.id).toBe(testConversation.id);
    });

    it('handles multiple conversations for same user', async () => {
      const context1 = { ...testContext, threadTs: '111.111' };
      const context2 = { ...testContext, threadTs: '222.222' };

      const conv1 = Conversation.startNew(testUserId, context1);
      const conv2 = Conversation.startNew(testUserId, context2);

      await repository.save(conv1);
      await repository.save(conv2);

      const result1 = await repository.findByUserAndContext(testUserId, context1);
      const result2 = await repository.findByUserAndContext(testUserId, context2);

      expect(result1?.id).toBe(conv1.id);
      expect(result2?.id).toBe(conv2.id);
      expect(result1?.id).not.toBe(result2?.id);
    });
  });
});
