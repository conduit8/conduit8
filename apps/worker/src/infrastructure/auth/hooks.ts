import type { User } from 'better-auth';
import type Stripe from 'stripe';

import { SendMagicLink, SubscriptionCancelled, SubscriptionPurchased, TrackUserSignup } from '@worker/domain/messages';
import { CloudflareQueueService } from '@worker/infrastructure/services/queue';

/**
 * Database hooks for Better Auth
 * Handles user lifecycle events
 */
export function createDatabaseHooks(env: Env) {
  return {
    user: {
      create: {
        after: async (user: User) => {
          console.log('[Auth] User created, sending UserSignedUp event:', user.id);
          const queueService = new CloudflareQueueService(env);
          const cmd = new TrackUserSignup(user.id);
          await queueService.send(cmd);
        },
      },
    },
  };
}

/**
 * Magic link hooks
 * Handles magic link email sending via queue
 */
export function createMagicLinkHooks(env: Env) {
  return {
    sendMagicLink: async ({ email, token, url }: { email: string; token: string; url: string }) => {
      const queueService = new CloudflareQueueService(env);

      const cmd = new SendMagicLink(email, url, token);

      // Send contract message via queue service
      await queueService.send(cmd);
    },
  };
}

/**
 * Stripe subscription hooks
 * Handles subscription lifecycle events
 */
export function createStripeSubscriptionHooks(env: Env) {
  return {
    onSubscriptionUpdate: async (
      { event, subscription: sub }:
      { event: Stripe.Event; subscription: any }) => {
      console.log(
        `Subscription updated: userId=${sub.referenceId}, plan=${sub.plan}, status=${sub.status}`,
      );

      // Track subscription purchases/upgrades when status becomes active
      if (event.type === 'customer.subscription.created' && sub.status === 'active') {
        const stripeSubscription = event.data.object as Stripe.Subscription;
        const plan = stripeSubscription.items.data[0]?.price;

        if (plan && sub.referenceId) {
          const amountCents = plan.unit_amount || 0;
          const currency = plan.currency || 'usd';
          const planType = plan.recurring?.interval === 'year' ? 'yearly' : 'monthly';

          const queueService = new CloudflareQueueService(env);
          const purchaseEvent = new SubscriptionPurchased(
            sub.referenceId,
            amountCents,
            currency,
            planType,
          );
          await queueService.send(purchaseEvent);

          console.log(`[Stripe] Queued SubscriptionPurchased for user ${sub.referenceId}: ${planType} ${amountCents}${currency}`);
        }
      }
    },

    onSubscriptionCancel: async ({
      subscription: sub,
    }: {
      event?: any;
      subscription: any;
      stripeSubscription?: any;
      cancellationDetails?: any;
    }) => {
      console.log(
        `Subscription cancelled: userId=${sub.referenceId}, plan=${sub.plan}, endsAt=${sub.periodEnd}`,
      );

      const queueService = new CloudflareQueueService(env);
      // Queue cancellation event for analytics
      const event = new SubscriptionCancelled(sub.referenceId, sub.plan);

      await queueService.send(event);
      console.log(`[Stripe] Queued cancellation event for user ${sub.referenceId}`);
    },
  };
}

/**
 * Stripe customer and event hooks
 * Handles customer creation and general Stripe events
 */
export function createStripeCustomerHooks(env: Env) {
  return {
    onCustomerCreate: async (
      { stripeCustomer, user }: { stripeCustomer: any; user: User },
      _ctx: any,
    ) => {
      console.log(`Customer ${stripeCustomer.id} created for user ${user.id}`);
    },

    onEvent: async (event: Stripe.Event) => {
      console.log(`[Stripe Event] ${event.type} - ${event.id}`);
      // Subscription purchases are handled in onSubscriptionUpdate hook
    },
  };
}

/**
 * Stripe checkout params hook
 * Customizes checkout session parameters based on user
 */
export function createStripeCheckoutHook(env: Env) {
  return {
    getCheckoutSessionParams: async ({ user }: { user: User }) => {
      return {
        params: {
          automatic_tax: { enabled: true },
          allow_promotion_codes: true,
        },
      };
    },
  };
}
