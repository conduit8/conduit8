/// <reference types="vitest" />
import tailwindcss from '@tailwindcss/vite';
import { tanstackRouter } from '@tanstack/router-plugin/vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'node:path';
import tsconfigPaths from 'vite-tsconfig-paths';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  plugins: [
    react(),
    tsconfigPaths(),
    tanstackRouter({
      target: 'react',
      autoCodeSplitting: true,
      // Routes directory
      routesDirectory: 'src/routes',
      // Path where to generate the route tree
      generatedRouteTree: 'src/routeTree.gen.ts',
    }),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      '@web': resolve(__dirname, './src'),
    },
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./test/unit/setup.tsx'],
    include: [
      'test/unit/**/*.unit.test.{ts,tsx}',
      'test/integration/**/*.integration.test.{ts,tsx}',
    ],
    exclude: ['node_modules'],
    coverage: {
      provider: 'istanbul',
      reporter: ['text', 'json', 'html'],
      include: ['src/**/*.{ts,tsx}'],
      exclude: [
        '**/*.test.{ts,tsx}',
        '**/*.spec.{ts,tsx}',
        'test/**/*',
        '**/node_modules/**',
        '**/dist/**',
        '**/*.d.ts',
        'vitest.config.ts',
      ],
      reportsDirectory: './coverage',
    },
  },
});
