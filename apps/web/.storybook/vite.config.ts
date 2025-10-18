import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';
import { defineConfig } from 'vite';
import svgr from 'vite-plugin-svgr';
import tsconfigPaths from 'vite-tsconfig-paths';

const ReactCompilerConfig = {
  target: '19',
};

// Storybook-specific Vite config
// This config only includes what's needed for React components
// No Cloudflare worker, no TanStack Router
export default defineConfig({
  plugins: [
    tsconfigPaths(),
    react({
      babel: {
        plugins: [['babel-plugin-react-compiler', ReactCompilerConfig]],
      },
    }),
    svgr(), // For SVG imports
    tailwindcss(),
  ],
  resolve: {
    alias: {
      '@web': resolve(__dirname, '../../src'),
    },
  },
  server: {
    host: 'localhost',
    open: false,
  },
  base: '/',
});
