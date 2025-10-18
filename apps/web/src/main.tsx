import { QueryClientProvider } from '@tanstack/react-query';
import { RouterProvider } from '@tanstack/react-router';
import { posthog, queryClient } from '@web/lib/clients';
import { router } from '@web/lib/router';
import { PostHogProvider } from 'posthog-js/react';
import { StrictMode } from 'react';
import ReactDOM from 'react-dom/client';

import { ErrorBoundary, Sentry } from '@web/lib/clients/sentry.client.ts';
import { ThemeProvider } from '@web/lib/hooks/use-theme.tsx';
import { UnhandledErrorPage } from '@web/pages/public/error.tsx';
import { Toaster } from '@web/ui/components/feedback/toasts/index.ts';

// Render the app
const rootElement = document.getElementById('root')!;
if (!rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement, {
    onUncaughtError: Sentry.reactErrorHandler((error, errorInfo) => {
      console.error('Uncaught error', error, errorInfo.componentStack);
    }),
    onCaughtError: Sentry.reactErrorHandler(),
    onRecoverableError: Sentry.reactErrorHandler(),
  });
  root.render(
    <StrictMode>
      <ErrorBoundary fallback={<UnhandledErrorPage />}>
        <PostHogProvider client={posthog}>
          <QueryClientProvider client={queryClient}>
            <ThemeProvider defaultTheme="light">
              <Toaster />
              <RouterProvider router={router} context={{ queryClient }} />
            </ThemeProvider>
          </QueryClientProvider>
        </PostHogProvider>
      </ErrorBoundary>
    </StrictMode>,
  );
}
