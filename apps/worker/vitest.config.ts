import { defineWorkersProject, readD1Migrations } from '@cloudflare/vitest-pool-workers/config';
import path from 'node:path';
import tsconfigPaths from 'vite-tsconfig-paths';
import { defineConfig } from 'vitest/config';

// if you use wrangler to build + add polyfills, you can then point vitest at the output which will be the same as what wrangler deploys.
// So run npx wrangler deploy --dry-run --outdir dist
// Then set [main](https://developers.cloudflare.com/workers/testing/vitest-integration/configuration/#workerspooloptions) in your vitest config to your build output.

export default defineConfig({
  test: {
    // Root level coverage configuration
    coverage: {
      provider: 'istanbul',
      // Reporters: 'text' for terminal, 'json' for CI tools, 'html' for detailed local reports
      reporter: ['text', 'json', 'html'],
      include: ['src/**/*.{ts,tsx}'],
      exclude: [
        'tests/**/*', // All tests
        '**/node_modules/**', // Node modules
        '**/dist/**', // Build output
        '**/*.d.ts', // TypeScript definition transcriptions
        'vitest.config.ts', // This config file
        'wrangler.jsonc', // Wrangler config
      ],
      reportsDirectory: './coverage',
    },

    projects: [
      // Worker Unit Tests - Simple setup, no migrations
      defineWorkersProject({
        plugins: [tsconfigPaths()],
        test: {
          name: 'worker-unit',
          include: ['test/unit/**/*.unit.test.ts', 'tests/unit/**/*.unit.test.ts'],
          setupFiles: ['./tests/setup.ts'],
          globals: true,
          poolOptions: {
            workers: {
              singleWorker: true,
              isolatedStorage: false, // Due to workflows
              remoteBindings: false, // Force local mode in CI
              miniflare: {
                compatibilityFlags: ['nodejs_compat'],
                compatibilityDate: '2025-09-01',
              },
              wrangler: {
                configPath: './wrangler.jsonc',
                environment: 'preview',
              },
            },
          },
        },
      }),

      // Worker Integration Tests - With migrations and real bindings
      defineWorkersProject(async () => {
        // Read all migrations in the `migrations` directory
        const migrationsPath = path.join(
          __dirname,
          'src/infrastructure/persistence/database/migrations',
        );
        const migrations = await readD1Migrations(migrationsPath);

        return {
          plugins: [tsconfigPaths()],
          test: {
            name: 'worker-integration',
            include: ['test/integration/**/*.integration.test.ts', 'tests/integration/**/*.integration.test.ts'],
            setupFiles: ['./tests/integration/integration-setup.ts', './tests/apply-migrations.ts'],
            globals: true,
            testTimeout: 15000, // 15 seconds default timeout for integration tests
            hookTimeout: 45000, // 45 seconds for setup/teardown hooks
            deps: {
              optimizer: {
                ssr: {
                  enabled: true,
                  include: ['better-auth', '@slack/web-api'],
                },
              },
            },
            poolOptions: {
              workers: {
                // Point to the built Worker output that has jose bundled correctly
                // main: './dist/index.js',
                singleWorker: true,
                // IMPORTANT: isolatedStorage must be false when using Workflows
                // This means storage (KV, D1, DO) persists between tests
                // Mitigation strategies:
                // 1. Use unique IDs for test data (crypto.randomUUID())
                // 2. Clean up test data in afterEach() hooks
                // 3. Don't rely on empty storage state - always initialize
                // 4. Consider separate test namespaces/databases if needed
                isolatedStorage: false,
                remoteBindings: false, // Force local mode in CI
                miniflare: {
                  // Required to use `SELF.scheduled()`. This is an experimental
                  // compatibility flag, and cannot be enabled in production.
                  compatibilityFlags: ['service_binding_extra_handlers', 'nodejs_compat'],
                  compatibilityDate: '2025-09-01',
                  vars: {
                    BETTER_AUTH_SECRET: 'test-secret-for-vitest-with-at-least-32-characters-long',
                    BETTER_AUTH_URL: 'http://localhost:5173',
                  },
                  // Add test-only binding for migrations
                  bindings: { TEST_MIGRATIONS: migrations },
                },
                wrangler: {
                  configPath: './wrangler.jsonc',
                  environment: 'preview',
                },
              },
            },
          },
        };
      }),
    ],
  },
});
