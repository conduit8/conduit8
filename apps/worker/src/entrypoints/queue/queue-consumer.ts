import { queueMessageSchema } from '@kollektiv/core';

import { MessageBus } from '@worker/application/message-bus';

import { MESSAGE_CONSTRUCTORS } from './registry';

const MAX_RETRY_DELAY = 120; // 2 minutes max
const BASE_RETRY_DELAY = 5; // 5 seconds base
const MAX_ATTEMPTS = 5; // Stop retrying after 5 attempts

export async function queue(batch: MessageBatch, env: Env): Promise<void> {
  const messageBus = new MessageBus(env);

  for (const message of batch.messages) {
    // 1. Validate message structure
    let parsedMessage;
    try {
      parsedMessage = queueMessageSchema.safeParse(message.body);
      if (!parsedMessage.success) {
        // Extract message name/type for better debugging
        const msgName = (message.body as any)?.payload?.name || 'unknown';
        const msgType = (message.body as any)?.payload?.type || 'unknown';

        console.error('✗ Invalid queue message format:', {
          messageName: msgName,
          messageType: msgType,
          zodError: parsedMessage.error.format(),
        });
        console.error('✗ Raw message body:', JSON.stringify(message.body, null, 2));

        // SHOULD we ack this message? it's not malformed, it's an error in zod?
        message.ack(); // Don't retry malformed messages
        continue;
      }
    }
    catch (e) {
      // This should NEVER happen - Zod's discriminated union is throwing
      console.error('✗ CRITICAL: Schema threw exception:', e instanceof Error ? e.message : e);

      // Log what message type was actually sent
      const msgType = (message.body as any)?.payload?.name;
      console.error(`  Message type received: "${msgType || 'undefined'}"`);
      console.error(`  Full message:`, JSON.stringify(message.body));

      message.ack(); // Don't retry - this is a schema issue
      continue;
    }

    const contractMsg = parsedMessage.data.payload;

    // Reconstruct domain object from contract
    const msg = MESSAGE_CONSTRUCTORS[contractMsg.name]?.(contractMsg);
    if (!msg) {
      console.error(`✗ No constructor for message: ${contractMsg.name}`);
      message.ack(); // Don't retry unknown messages
      continue;
    }

    try {
      // 2. Handle domain message
      await messageBus.handle(msg, env);

      // 3. Success - acknowledge
      message.ack();
      console.info(`✓ Processed ${msg.name}`);
    }
    catch (error) {
      console.error(`✗ Failed ${msg.name} (attempt ${message.attempts}/${MAX_ATTEMPTS})`, error);

      // TODO: [CRITICAL - ERROR CLASSIFICATION] Stop infinite retries on permanent failures
      // Create ErrorClassifier class with isRetryable(error) method:
      // - Retryable: timeout, ECONNREFUSED, rate limits, 5xx status codes
      // - Non-retryable: Invalid repository, User not found, 4xx status codes
      // - If non-retryable: Send to DLQ and ACK immediately
      // - If retryable: Continue with exponential backoff
      // This prevents queue backup from permanently failing messages

      // Check if we should retry
      if (message.attempts >= MAX_ATTEMPTS) {
        console.error(`⚠️ Max attempts reached for ${msg.name}. Moving to DLQ.`);
        message.ack(); // Acknowledge to stop retries
        continue;
      }

      // 4. Error - retry with gentler exponential backoff
      const delay = Math.min(
        Math.floor(BASE_RETRY_DELAY * 1.5 ** (message.attempts - 1)),
        MAX_RETRY_DELAY,
      );

      message.retry({ delaySeconds: delay });
    }
  }
}
