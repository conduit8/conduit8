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
 * Event: R2 object created
 * Fired by R2 on PutObject, CopyObject, CompleteMultipartUpload
 * Triggers IngestSkill command for ZIP files in inbox/
 */
export class R2ObjectCreated extends BaseEvent {
  readonly name = 'R2ObjectCreated';

  constructor(
    public readonly fileKey: string,
    public readonly eventTime: string,
    public readonly action: string,
  ) {
    super();
  }
}
