import type { ProductTier } from './product-tiers';

/**
 * Usage limits per tier
 * These are business rules that define what each tier can do
 */
export const USAGE_LIMITS: Record<
  ProductTier,
  { lifetimeTranscriptions: number; maxDurationSeconds: number }
> = {
  free: {
    lifetimeTranscriptions: 3, // Free trial: 3 total transcriptions
    maxDurationSeconds: 3 * 60 * 60, // 3 hours per file for trial users
  },
  premium: {
    lifetimeTranscriptions: Infinity, // Unlimited
    maxDurationSeconds: Infinity, // No duration limit for premium
  },
} as const;

/**
 * Helper to get lifetime transcription limit for a tier
 */
export function getLifetimeTranscriptionLimit(tier: ProductTier): number {
  return USAGE_LIMITS[tier].lifetimeTranscriptions;
}

/**
 * Check if a tier has unlimited transcriptions
 */
export function hasUnlimitedTranscriptions(tier: ProductTier): boolean {
  return USAGE_LIMITS[tier].lifetimeTranscriptions === Infinity;
}

/**
 * Get max duration in seconds for a tier
 */
export function getMaxDurationSeconds(tier: ProductTier): number {
  return USAGE_LIMITS[tier].maxDurationSeconds;
}

/**
 * Check if a tier has duration limits
 */
export function hasDurationLimit(tier: ProductTier): boolean {
  return USAGE_LIMITS[tier].maxDurationSeconds !== Infinity;
}
