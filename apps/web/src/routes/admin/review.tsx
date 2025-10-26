import { createFileRoute } from '@tanstack/react-router';
import { SkillsReviewPage } from '@web/pages/shared';

/**
 * Admin Review Route
 * Review pending skill submissions
 *
 * Auth + role check inherited from parent layout (admin/route.tsx)
 */

export const Route = createFileRoute('/admin/review')({
  component: SkillsReviewPage,
});
