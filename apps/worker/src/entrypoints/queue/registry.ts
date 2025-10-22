import type { BaseMessage } from '@worker/domain/messages/base';

import {
  IngestSkill,
  SendMagicLink,
  TrackSkillDownload,
  TrackUserSignup,
} from '@worker/domain/messages/commands';
import {
  R2ObjectCreated,
} from '@worker/domain/messages/events';

// Reconstructs domain objects from queue messages
// External events (e.g., 'r2:PutObject') use string keys; domain messages use ClassName.name
export const MESSAGE_CONSTRUCTORS: Record<string, (msg: any) => BaseMessage> = {
  // Auth Commands
  [SendMagicLink.name]: msg => new SendMagicLink(msg.email, msg.magicLinkUrl, msg.token),
  [TrackUserSignup.name]: msg => new TrackUserSignup(msg.userId),

  // Skill Commands
  [IngestSkill.name]: msg => new IngestSkill(msg.fileKey),
  [TrackSkillDownload.name]: msg => new TrackSkillDownload(msg.slug),

  // R2 Events - object-create actions
  'r2:PutObject': msg => new R2ObjectCreated(msg.object.key, msg.eventTime, msg.action),
};
