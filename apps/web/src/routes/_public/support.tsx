import { createFileRoute } from '@tanstack/react-router';

import { SupportPage } from '@web/pages/public/support';

export const Route = createFileRoute('/_public/support')({
  component: SupportPage,
});
