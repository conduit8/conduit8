import { handleUserSignedUp, sendMagicLink } from '@worker/application/handlers/auth';

import type { CommandName, EventName, QueryName } from '@worker/domain/messages/types';

// Command handlers registry - one handler per command
export const COMMAND_HANDLERS = {
  // Auth
  SendMagicLink: sendMagicLink,
  TrackUserSignup: handleUserSignedUp,
} satisfies Partial<Record<CommandName, any>>;

// Event handlers registry - multiple handlers per event
// TypeScript allows partial coverage (events can have 0 handlers)
export const EVENT_HANDLERS = {
  // Billing
  SubscriptionPurchased: [],
  SubscriptionCancelled: [],

  // File operations
  R2UploadCompleteNotification: [],

} satisfies Partial<Record<EventName, any[]>>;

// Query handlers registry - one handler per query
// TypeScript will ensure all QueryNames have handlers
export const QUERY_HANDLERS = {

} satisfies Partial<Record<QueryName, any>>;
