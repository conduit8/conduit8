import { APP_ROUTES } from '@conduit8/core';
import { z, ZodError } from 'zod';

// Environment schema
const envSchema = z.object({
  MODE: z.enum(['development', 'production', 'preview']).default('development'),
  VITE_BASE_URL: z.url(),
  VITE_SENTRY_DSN: z.string().optional(),
  VITE_PUBLIC_POSTHOG_KEY: z.string(),
  VITE_TURNSTILE_SITE_KEY: z.string().optional(),
});

// Parse and validate environment
function parseEnv() {
  try {
    return envSchema.parse(import.meta.env);
  }
  catch (error) {
    if (error instanceof ZodError) {
      const messages = error.issues.map(e => `${e.path.join('.')}: ${e.message}`).join(', ');
      console.error('Configuration Error:', messages);
      throw new Error(`Configuration Error: ${messages}`);
    }
    throw error;
  }
}

const env = parseEnv();

const isDevelopment = env.MODE === 'development';
const isPreview = env.MODE === 'preview';
const isProduction = env.MODE === 'production';

export const settings = {
  mode: env.MODE,
  isDevelopment,
  isPreview,
  isProduction,

  logging: {
    level: isDevelopment ? 0 : 3,
    enableConsole: true,
  },

  app: {
    name: 'Conduit8',
    baseUrl: env.VITE_BASE_URL,
    paths: {
      auth: '/auth',
    },
    authUrl: `${env.VITE_BASE_URL}/auth`,
  },

  sentry: {
    dsn: env.VITE_SENTRY_DSN,
    environment: env.MODE,
    sampleRate: isDevelopment ? 0 : 0.85,
    tracesSampleRate: isDevelopment ? 0 : 0.25,
    profilesSampleRate: 0.8,
  },

  site: {
    url: isDevelopment
      ? 'http://localhost:5173'
      : isPreview
        ? 'https://preview.conduit8.dev'
        : 'https://conduit8.dev',
  },

  posthog: {
    apiKey: env.VITE_PUBLIC_POSTHOG_KEY,
    apiHost: isDevelopment
      ? 'https://us.i.posthog.com' // Direct in dev for debugging
      : `${env.VITE_BASE_URL}${APP_ROUTES.api.prefix}${APP_ROUTES.api.paths.posthogProxy}`,
    enabled: !isDevelopment,
  },

  turnstile: {
    siteKey: env.VITE_TURNSTILE_SITE_KEY,
  },
};
