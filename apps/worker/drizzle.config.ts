import { defineConfig } from 'drizzle-kit';

const isProd = process.env.DRIZZLE_ENV === 'production';

export default defineConfig({
  schema: './src/infrastructure/persistence/database/schema',
  out: './src/infrastructure/persistence/database/migrations',
  dialect: 'sqlite',

  ...(isProd
    ? {
        driver: 'd1-http',
        dbCredentials: {
          accountId: process.env.CLOUDFLARE_ACCOUNT_ID!,
          databaseId: process.env.CLOUDFLARE_DATABASE_ID!,
          token: process.env.CLOUDFLARE_D1_TOKEN!,
        },
      }
    : {
        dbCredentials: {
          url: '.wrangler/state/v3/d1/miniflare-D1DatabaseObject/4084a03965ec6ae603dabbe2e647b0124de7f4c7e29db01df9e1dfa9278adc1b.sqlite',
        },
      }),

  strict: true,
  verbose: true,
  tablesFilter: ['!_cf_KV'],
});
