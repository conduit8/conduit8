import { defineConfig } from 'tsdown';

export default defineConfig({
  // Single entry point for the new approach
  entry: 'src/index.ts',

  // Match your current output format
  format: 'esm',

  // Generate TypeScript declaration files
  dts: true,

  // Clean output directory before build
  clean: true,

  // Output to dist (replacing tsc output)
  outDir: './dist',

  // Use your existing tsconfig
  tsconfig: './tsconfig.json',

  // Minification off for easier debugging during transition
  minify: true,

  // External dependencies (don't bundle them)
  external: [
    'camelcase-keys',
    'snakecase-keys',
    'zod',
  ],
});
