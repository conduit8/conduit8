/**
 * Stripe configuration
 * Price IDs are not sensitive and can be stored in code
 * Only secret keys and webhook secrets should be in environment variables
 */

export const STRIPE_CONFIG = {
  test: {
    prices: {
      monthly: 'price_1Rsq75D5dvpXuvLqfLlm8HDZ',
      yearly: 'price_1Rsq7rD5dvpXuvLqcqWpgwbM',
    },
  },
  live: {
    prices: {
      monthly: 'price_1RtR2HDGi8KWRsUNYUnB19nF',
      yearly: 'price_1RtR2HDGi8KWRsUNhWHceTPf',
    },
  },
};
