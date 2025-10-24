import { sentryVitePlugin } from '@sentry/vite-plugin';
import tailwindcss from '@tailwindcss/vite';
import tanstackRouter from '@tanstack/router-plugin/vite';
import react from '@vitejs/plugin-react';
import Icons from 'unplugin-icons/vite';
import { defineConfig } from 'vite';
import svgr from 'vite-plugin-svgr';
import tsconfigPaths from 'vite-tsconfig-paths';

const ReactCompilerConfig = {
  target: '19',
};

// https://vite.dev/config/
export default defineConfig({
  plugins: [tanstackRouter({
    target: 'react',
    autoCodeSplitting: true,
    routeTreeFileHeader: [
      '/* eslint-disable eslint-comments/no-unlimited-disable */',
      '/* eslint-disable */',
    ],
    // Routes directory
    routesDirectory: 'src/routes',
    // Path where to generate the route tree
    generatedRouteTree: 'src/lib/router/routeTree.gen.ts',
  }), tsconfigPaths(), react({
    babel: {
      plugins: [['babel-plugin-react-compiler', ReactCompilerConfig]],
    },
  }), svgr(), Icons({
    compiler: 'jsx',
    jsx: 'react',
  }), tailwindcss(), sentryVitePlugin({
    org: 'azcompany',
    project: 'conduit8-ui',
    authToken: process.env.SENTRY_AUTH_TOKEN,
    sourcemaps: {
      filesToDeleteAfterUpload: ['dist/**/*.map'],
    },

  })],
  build: {
    // outDir defaults to 'dist'
    emptyOutDir: true,
    chunkSizeWarningLimit: 1000,
    sourcemap: true,
  },
  server: {
    host: true, // Expose to local network
    port: 5173,
    open: false, // do not open window

    proxy: {
      '/api': 'http://localhost:8787',
      '/auth': 'http://localhost:8787',
    },
  },
});
