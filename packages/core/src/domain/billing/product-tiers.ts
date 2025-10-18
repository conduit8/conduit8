import { z } from 'zod';
/**
 * Subscription tiers
 *
 * Separates concerns between:
 * - Product Tier: What features/access level user has
 */

// Product tiers - defines feature access level
export const ProductTierSchema = z.enum([
  'free',
  'premium',
  // Future: 'ultra', 'enterprise'
]);
export type ProductTier = z.infer<typeof ProductTierSchema>;
