import { z } from 'zod';

// Query params schema - validates URL with security checks
export const imageProxyRequestSchema = z.object({
  url: z.url({
    hostname: /^(?!localhost|0\.0\.0\.0|127\.|192\.168\.|10\.|172\.)/i,
  }),
});

export type ImageProxyRequest = z.infer<typeof imageProxyRequestSchema>;
