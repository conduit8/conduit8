import { createFileRoute } from '@tanstack/react-router';
import { SkillsReviewPage } from '@web/pages/shared';

export const Route = createFileRoute('/_authed/my-submissions')({
  component: SkillsReviewPage,
});
