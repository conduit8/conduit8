import type { CommandHandler } from '@worker/application/handlers/types';
import type { TrackUserSignup } from '@worker/domain/messages/commands';

import { PostHogAnalyticsService } from '@worker/infrastructure/services/analytics/posthog-analytics-service';

export const handleUserSignedUp: CommandHandler<TrackUserSignup, void> = async (
  command: TrackUserSignup,
  env: Env,
) => {
  const posthog = new PostHogAnalyticsService(env);
  posthog.track('user signed up', command.userId);
  await posthog.shutdown();

  return {
    result: undefined,
    events: [],
  };
};
