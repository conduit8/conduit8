import tsconfigPaths from 'vite-tsconfig-paths';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  plugins: [tsconfigPaths()],
  test: {
    globals: true,
    environment: 'node',
    include: ['tests/**/*.test.ts'],
    coverage: {
      provider: 'istanbul',
      reporter: ['text', 'json', 'html'],
      include: ['src/**/*.{ts,tsx}'],
      exclude: [
        'tests/**/*',
        '**/node_modules/**',
        '**/dist/**',
        '**/*.d.ts',
        'vitest.config.ts',
      ],
      reportsDirectory: './coverage',
    },
  },
});
