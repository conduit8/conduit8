import type { BaseMessage } from '@worker/domain/messages/base';

import {
  SendMagicLink,
  TrackUserSignup,
} from '@worker/domain/messages/commands';
import {
  R2UploadCompleteNotification,
} from '@worker/domain/messages/events';

// Registry maps message names to domain message constructors
// Used to reconstruct domain objects from parsed contract data
export const MESSAGE_CONSTRUCTORS: Record<string, (msg: any) => BaseMessage> = {
  // Auth Commands
  'SendMagicLink': msg => new SendMagicLink(msg.email, msg.magicLinkUrl, msg.token),
  'TrackUserSignup': msg => new TrackUserSignup(msg.userId),

  'R2UploadCompleteNotification': msg =>
    new R2UploadCompleteNotification(msg.fileKey, msg.eventTime, msg.action),

  // R2 event mapping - only handle PutObject for now
  'r2:PutObject': msg => new R2UploadCompleteNotification(msg.object.key, msg.eventTime, msg.action),
  // Ignore other R2 actions - we don't process them
};
