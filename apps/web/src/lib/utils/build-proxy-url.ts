import { getApiRoute } from '@conduit8/core';

/**
 * Builds a proxy URL for external images
 *
 * Transforms external image URLs to use our proxy endpoint
 * which caches images in KV and avoids CORS issues
 */
export function buildProxyImageUrl(externalUrl: string | null): string | null {
  if (!externalUrl)
    return null;

  const proxyRoute = getApiRoute('imageProxy');
  const params = new URLSearchParams({ url: externalUrl });

  return `${proxyRoute}?${params}`;
}
