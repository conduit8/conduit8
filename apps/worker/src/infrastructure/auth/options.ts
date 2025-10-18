import type { BetterAuthOptions } from 'better-auth';

// import Stripe from 'stripe';
// import { stripe } from '@better-auth/stripe';
// import { STRIPE_CONFIG } from '@kollektiv/core';
import { captcha, magicLink, openAPI } from 'better-auth/plugins';

import {
  createDatabaseHooks,
  createMagicLinkHooks,
  // createStripeCustomerHooks,
  // createStripeSubscriptionHooks,
} from './hooks';
import { createKVStorage, createRateLimitStorage } from './storage';

/**
 * Factory function to create BetterAuthOptions
 * When env is not provided (CLI mode), returns options with stub functions
 * When env is provided (runtime), returns fully Kollektiv options
 */
export function createBetterAuthOptions(
  database: NonNullable<BetterAuthOptions['database']>,
  env?: Env,
): BetterAuthOptions {
  // Detect if we're in CLI mode (no env provided)
  const isCliMode = !env;

  // Detect if we're in development mode (DEV environment)
  const isDevMode = env?.ENV === 'development';

  // Build hooks only if we have env (runtime mode)
  const databaseHooks = isCliMode ? undefined : createDatabaseHooks(env);
  const magicLinkHooks = isCliMode ? undefined : createMagicLinkHooks(env);
  // const stripeSubscriptionHooks = isCliMode ? undefined : createStripeSubscriptionHooks(env);
  // const stripeCustomerHooks = isCliMode ? undefined : createStripeCustomerHooks(env);

  // Build storage only if we have env
  const kvStorage = isCliMode ? undefined : createKVStorage(env.AUTH_KV);
  const rateLimitStorage = isCliMode ? undefined : createRateLimitStorage(env.AUTH_RATE_LIMITER_DO);

  return {
    appName: 'conduit8',
    baseURL: env?.BETTER_AUTH_URL, // always exists if not run via CLI
    // basePath: APP_ROUTES.auth.basePath,
    database,

    user: {
      additionalFields: {
        stripeCustomerId: {
          type: 'string',
          required: false,
          defaultValue: null,
          input: false,
        },
      },
    },

    databaseHooks,

    trustedOrigins: [
      'http://localhost:5173',
      'https://preview.conduit8.dev',
      'https://conduit8.dev',
    ],

    advanced: {
      ipAddress: {
        ipAddressHeaders: ['cf-connecting-ip', 'x-forwarded-for'],
      },
      // For localhost development with different ports
      ...(isDevMode && {
        defaultCookieAttributes: {
          sameSite: 'lax' as const,
          secure: false,
        },
      }),
    },

    secondaryStorage: kvStorage,

    session: {
      expiresIn: 60 * 60 * 24 * 7, // 7 days
      updateAge: 60 * 60 * 24, // Update session if older than 1 day
      freshAge: 60 * 60 * 24, // Session considered fresh for 1 day
      cookieCache: {
        enabled: true,
        maxAge: 5 * 60, // 5 minutes cache
      },
    },

    rateLimit: rateLimitStorage
      ? {
          enabled: true,
          customStorage: rateLimitStorage,
        }
      : {
          enabled: false,
        },

    emailAndPassword: {
      enabled: true,
    },

    socialProviders: {
      google: {
        clientId: env?.GOOGLE_CLIENT_ID || '',
        clientSecret: env?.GOOGLE_CLIENT_SECRET || '',
      },
    },

    plugins: [
      // Captcha plugin
      captcha({
        provider: 'cloudflare-turnstile',
        secretKey: env?.TURNSTILE_SECRET_KEY || '',
      }),

      // OpenAPI documentation
      openAPI(),

      // Magic link - with optional hook
      magicLink({
        sendMagicLink: magicLinkHooks?.sendMagicLink || (async () => {}),
        expiresIn: 300, // 5 minutes
      }),

      // Stripe plugin - with fallback for schema generation
      // stripe({
      //   stripeClient: env?.STRIPE_SECRET_KEY
      //     ? new Stripe(env.STRIPE_SECRET_KEY, {
      //       httpClient: Stripe.createFetchHttpClient(),
      //     })
      //     : ({} as any), // Dummy for schema generation
      //   stripeWebhookSecret: env?.STRIPE_WEBHOOK_SECRET || '',
      //   createCustomerOnSignUp: true,
      //   subscription: {
      //     enabled: true,
      //     plans: [
      //       {
      //         name: 'premium',
      //         priceId:
      //           env?.ENV === 'production'
      //             ? STRIPE_CONFIG.live.prices.monthly
      //             : STRIPE_CONFIG.test.prices.monthly,
      //         annualDiscountPriceId:
      //           env?.ENV === 'production'
      //             ? STRIPE_CONFIG.live.prices.yearly
      //             : STRIPE_CONFIG.test.prices.yearly,
      //       },
      //     ],
      //     getCheckoutSessionParams: async ({ user }) => {
      //       // Special discount for mom
      //       const isSpecialUser = user.email === env?.MOM_EMAIL;

      //       if (isSpecialUser) {
      //         return {
      //           params: {
      //             automatic_tax: { enabled: true },
      //             discounts: [{ coupon: 'i-am-zueva' }],
      //           },
      //         };
      //       }

      //       return {
      //         params: {
      //           automatic_tax: { enabled: true },
      //           allow_promotion_codes: true,
      //         },
      //       };
      //     },
      //     // onSubscriptionUpdate: stripeSubscriptionHooks?.onSubscriptionUpdate,
      //     // onSubscriptionCancel: stripeSubscriptionHooks?.onSubscriptionCancel,
      //   },
      //   // onCustomerCreate: stripeCustomerHooks?.onCustomerCreate,
      //   // onEvent: stripeCustomerHooks?.onEvent,
      // }),
    ],
  };
}
