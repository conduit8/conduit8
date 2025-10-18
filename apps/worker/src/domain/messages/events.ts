import { BaseEvent } from './base';

/**
 * Event: Subscription purchased
 * Can trigger: Analytics tracking, usage limit updates
 */
export class SubscriptionPurchased extends BaseEvent {
  readonly name = 'SubscriptionPurchased';

  constructor(
    public readonly userId: string,
    public readonly amountCents: number,
    public readonly currency: string,
    public readonly planType: string,
  ) {
    super();
  }
}

/**
 * Event: Subscription cancelled
 * Can trigger: Analytics tracking, usage limit updates
 */
export class SubscriptionCancelled extends BaseEvent {
  readonly name = 'SubscriptionCancelled';

  constructor(
    public readonly userId: string,
    public readonly plan: string,
  ) {
    super();
  }
}

/**
 * Event: R2 upload complete notification
 * Currently not handled
 */
export class R2UploadCompleteNotification extends BaseEvent {
  readonly name = 'R2UploadCompleteNotification';

  constructor(
    public readonly fileKey: string,
    public readonly eventTime: string,
    public readonly action: string,
  ) {
    super();
  }
}

/**
 * Event: Feedback submitted by user
 * Triggers: Slack notification to admin channel
 */
export class FeedbackSubmitted extends BaseEvent {
  readonly name = 'FeedbackSubmitted';

  constructor(
    public readonly feedbackId: string,
    public readonly userId: string,
    public readonly teamId: string,
    public readonly feedbackType: 'bug' | 'feature',
    public readonly message: string,
    public readonly followUpEmail?: string,
  ) {
    super();
  }
}

/**
 * Event: Slack app installed to workspace
 * Can trigger: Send welcome message, create default settings, analytics
 */
export class SlackAppInstalled extends BaseEvent {
  readonly name = 'SlackAppInstalled';

  constructor(
    public readonly teamId: string,
    public readonly teamName: string,
    public readonly botUserId: string,
    public readonly appId: string,
    public readonly scopes: string[],
    public readonly enterpriseId?: string,
    public readonly enterpriseName?: string,
    public readonly installedAt: string = new Date().toISOString(),
  ) {
    super();
  }
}

// ==========================================
// Conversation Domain Events
// ==========================================

/**
 * Event: New conversation started
 * Emitted when: First message in a new thread
 */
export class ConversationStarted extends BaseEvent {
  readonly name = 'ConversationStarted';

  constructor(
    public readonly conversationId: string,
    public readonly platformUserId: string,
    public readonly platform: 'slack',
    public readonly channel: string,
    public readonly threadTs: string,
    public readonly startedAt: string = new Date().toISOString(),
  ) {
    super();
  }
}

/**
 * Event: User started a conversation turn
 * Emitted when: User sends a message in conversation
 */
export class ConversationTurnStarted extends BaseEvent {
  readonly name = 'ConversationTurnStarted';

  constructor(
    public readonly conversationId: string,
    public readonly userId: string,
    public readonly sessionId: string | undefined,
    public readonly message: string,
    public readonly startedAt: string = new Date().toISOString(),
  ) {
    super();
  }
}

/**
 * Event: Conversation turn completed
 * Emitted when: Claude finishes responding
 * Can trigger: Session persistence to queue
 */
export class ConversationTurnCompleted extends BaseEvent {
  readonly name = 'ConversationTurnCompleted';

  constructor(
    public readonly conversationId: string,
    public readonly userId: string,
    public readonly sessionId: string,
    public readonly previousSessionId: string | undefined,
    public readonly sessionChanged: boolean,
    public readonly cost?: number,
    public readonly completedAt: string = new Date().toISOString(),
  ) {
    super();
  }
}

/**
 * Event: Conversation turn failed
 * Emitted when: an error is raised during conversation turn
 * Can trigger: Session persistence and communication with the user
 */
export class ConversationTurnFailed extends BaseEvent {
  readonly name = 'ConversationTurnFailed';

  constructor(
    public readonly conversationId: string,
    public readonly userId: string,
    public readonly teamId: string,
    public readonly channel: string,
    public readonly threadTs: string,
    public readonly sessionId?: string, // Present = partial response occurred
    public readonly errMsg?: string, // Include error message if available
  ) {
    super();
  }
}

/**
 * Event: Session restoration needed
 * Emitted when: Container restarted and session needs restore
 */
export class SessionRestoreRequired extends BaseEvent {
  readonly name = 'SessionRestoreRequired';

  constructor(
    public readonly conversationId: string,
    public readonly sessionId: string,
    public readonly userId: string,
    public readonly requestedAt: string = new Date().toISOString(),
  ) {
    super();
  }
}

// ==========================================
// User Domain Events
// ==========================================

/**
 * Event: User configured their Claude instance
 * Emitted when: User completes initial setup
 */
export class UserConfigured extends BaseEvent {
  readonly name = 'UserConfigured';

  constructor(
    public readonly userId: string,
    public readonly platform: string,
    public readonly configuredAt: string = new Date().toISOString(),
  ) {
    super();
  }
}

/**
 * Event: User updated their configuration
 * Emitted when: User changes API keys or settings
 */
export class UserConfigurationUpdated extends BaseEvent {
  readonly name = 'UserConfigurationUpdated';

  constructor(
    public readonly userId: string,
    public readonly teamId: string,
    public readonly platform: string,
    public readonly updatedAt: string = new Date().toISOString(),
  ) {
    super();
  }
}

/**
 * Event: User needs configuration
 * Emitted when: Unconfigured user tries to use bot
 */
export class UserConfigurationRequired extends BaseEvent {
  readonly name = 'UserConfigurationRequired';

  constructor(
    public readonly userId: string,
    public readonly channel: string,
    public readonly threadTs?: string,
    public readonly requestedAt: string = new Date().toISOString(),
  ) {
    super();
  }
}
