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
