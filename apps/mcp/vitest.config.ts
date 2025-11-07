import path from 'node:path';

import { defineWorkersConfig } from '@cloudflare/vitest-pool-workers/config';

export default defineWorkersConfig({
  resolve: {
    alias: {
      '@mcp': path.resolve(__dirname, './src'),
    },
  },
  test: {
    poolOptions: {
      workers: {
        wrangler: { configPath: './wrangler.jsonc' },
      },
    },
  },
});
