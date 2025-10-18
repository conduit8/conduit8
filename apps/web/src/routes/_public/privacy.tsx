import { createFileRoute } from '@tanstack/react-router';

import { PrivacyPage } from '@web/pages/public/privacy';

export const Route = createFileRoute('/_public/privacy')({
  component: PrivacyPage,
});
