import { createFileRoute } from '@tanstack/react-router';

import { TermsPage } from '@web/pages/public/terms';

export const Route = createFileRoute('/_public/terms')({
  component: TermsPage,
});
