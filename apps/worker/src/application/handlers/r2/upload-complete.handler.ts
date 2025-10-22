import type { EventHandler } from '@worker/application/handlers/types';
import type { R2ObjectCreated } from '@worker/domain/messages/events';

import { MessageBus } from '@worker/application/message-bus';
import { IngestSkill } from '@worker/domain/messages/commands';

/**
 * Event handler for R2 object created notifications
 * Routes to appropriate commands based on file key prefix
 */
export const handleR2UploadComplete: EventHandler<R2ObjectCreated> = async (
  event: R2ObjectCreated,
  env: Env,
) => {
  const { fileKey } = event;

  // Route to appropriate handler based on file key prefix
  if (fileKey.startsWith('inbox/skills/') && fileKey.endsWith('.zip')) {
    const command = new IngestSkill(fileKey);
    const messageBus = new MessageBus(env);
    await messageBus.handle(command, env);
    console.log(`[R2ObjectCreated] Successfully queued IngestSkill command for: ${fileKey}`);
    return;
  }

  // Add more routing logic here for other file types/prefixes
  // Example: inbox/avatars/*.png -> ProcessAvatar command

  console.log(`[R2ObjectCreated] No handler for file: ${fileKey}`);
};
