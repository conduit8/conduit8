import { env } from 'cloudflare:workers';
import { cors } from 'hono/cors';

// TODO: update to fit the mcp
export const globalCors = cors({
  origin:
    env.ENV === 'development'
      ? ['http://localhost:5173']
      : env.ENV === 'preview'
        ? ['https://preview.conduit8.dev']
        : ['https://conduit8.dev'],
  allowHeaders: [
    'Content-Type',
    'Authorization',
    'Cookie',
    'baggage',
    'sentry-trace',
    'x-captcha-response',
  ],
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  exposeHeaders: ['Content-Length', 'Set-Cookie', 'X-Retry-After'],
  maxAge: 3600,
  credentials: true,
});
