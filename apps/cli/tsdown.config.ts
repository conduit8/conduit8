import { readFileSync } from 'node:fs';
import { defineConfig } from 'tsdown';

const packageJson = JSON.parse(readFileSync('./package.json', 'utf-8'));

export default defineConfig({
  // Single entry point - CLI executable
  entry: 'src/index.ts',

  // ESM format for modern Node.js
  format: 'esm',

  // Generate TypeScript declaration files
  dts: true,

  // Clean output directory before build
  clean: true,

  // Output to dist directory
  outDir: './dist',

  // Use tsconfig for type checking
  tsconfig: './tsconfig.json',

  // Minify for smaller binary size
  minify: true,

  // Node platform target
  platform: 'node',

  // Target modern Node.js (22 LTS)
  target: 'node22',

  // External dependencies (don't bundle them)
  external: [
    'commander',
    'chalk',
    'ora',
    'tar',
    'js-yaml',
  ],

  // Generate sourcemaps for debugging
  sourcemap: false,

  // Rolldown input options - inject version at build time
  inputOptions: {
    transform: {
      define: {
        __VERSION__: JSON.stringify(packageJson.version),
      },
    },
  },
});
