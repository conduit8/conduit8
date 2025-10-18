/// <reference types="vite/client" />
/// <reference types="vite-plugin-svgr/client" />

import type { router } from '@web/lib/router';

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

// Cloudflare Zaraz Analytics
declare global {
  interface Window {
    zaraz?: {
      track: (eventName: string, eventProperties?: Record<string, any>) => Promise<void>;
      set: (key: string, value: any, options?: { scope?: 'page' | 'session' | 'persist' }) => void;
      ecommerce: (eventName: string, parameters?: Record<string, any>) => Promise<void>;
      consent?: {
        getAll: () => Record<string, boolean>;
        get: (purpose: string) => boolean;
        set: (purposes: Record<string, boolean>) => void;
        setAll: (value: boolean) => void;
      };
    };
  }
}
