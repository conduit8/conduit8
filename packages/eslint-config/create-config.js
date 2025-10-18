import antfu from '@antfu/eslint-config';

export default function createConfig(options, ...userConfigs) {
  return antfu({
    type: 'app',
    typescript: true,
    formatters: true, // enable all formatters
    stylistic: {
      indent: 2,
      quotes: 'single',
      semi: true,
    },
    ...options,
  },
  // Common ignores for all projects
  {
    ignores: [
      '**/node_modules/**', // Dependencies,
      '.pnpm-store/**', // PNPM store
      'dist/**', // Build output
      'build/**', // Alternative build output
      '**/.wrangler/**', // Cloudflare cache
      '**/worker-configuration.d.ts', // Cloudflare generated
      '**/*.gen.ts', // Any generated files
      '**/*.gen.tsx', // Any generated components
    ],
  },
  // TypeScript and base rules
  {
    rules: {

      // Console and async
      'no-console': 'off',
      'antfu/no-top-level-await': ['off'],

      // Node rules
      'node/no-process-env': ['off'], // Changed to off since you use process.env
      'node/prefer-global/process': ['off'], // Allow global process.env usage

      // Override unused-imports to be warning instead of error
      'unused-imports/no-unused-vars': ['warn', {
        argsIgnorePattern: '^_',
        varsIgnorePattern: '^_',
        ignoreRestSiblings: true,
        args: 'after-used',
      }],

      // Import sorting - use tsconfig for proper path alias resolution
      'perfectionist/sort-imports': ['error', {
        tsconfig: {
          rootDir: '.',
        },
      }],

      // File naming
      'unicorn/filename-case': ['error', {
        case: 'kebabCase',
        ignore: [
          'README.md',
          '^.*\\.config\\.(js|ts|mjs)$', // Match any .config.{js,ts,mjs} files
          '__root.tsx',
          '.*_snapshot\\.json$', // Drizzle migration snapshot files
          '^__.*', // Any file starting with __ (internal files)
        ],
      }],

      // STYLISTIC RULES
      // Disable JSDoc alignment - prevents conflict with no-trailing-spaces
      // and aligned JSDoc tags don't provide real value
      'jsdoc/check-alignment': 'off',

      // Match Prettier's trailing comma behavior
      '@stylistic/comma-dangle': ['warn', 'always-multiline'],

      // Match Prettier's 100 character line width
      '@stylistic/max-len': ['warn', {
        code: 100,
        comments: 120,
        ignoreUrls: true,
        ignoreStrings: true,
        ignoreTemplateLiterals: true,
        ignoreRegExpLiterals: true,
      }],

    },
  },
  // CSS files - disable tab checking
  {
    files: ['**/*.css'],
    rules: {
      'style/no-tabs': 'off',
    },
  },
  // Relaxed rules for ALL test files across the monorepo
  {
    files: ['**/*.test.*', '**/*.spec.*', '**/test/**', '**/tests/**', '**/__tests__/**', '**/*.stories.*', '.storybook/**'],
    rules: {
      // Disable all style/naming rules for tests
      'unicorn/filename-case': 'off',
      'unicorn/prefer-node-protocol': 'off',
      'unicorn/prefer-number-properties': 'off',

      // Some node rules
      'node/prefer-global/buffer': 'off',
      // Allow console in tests
      'no-console': 'off',

      // Relax TypeScript strictness
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-non-null-assertion': 'off',
      '@typescript-eslint/no-unused-vars': 'off',
      'unused-imports/no-unused-vars': 'off',
      'unused-imports/no-unused-imports': 'off',

      // Relax React rules for stories
      'react-hooks/rules-of-hooks': 'off',
      'react-hooks-extra/no-unnecessary-use-prefix': 'off',
      'react/no-unstable-context-value': 'off',
      'react-refresh/only-export-components': 'off',

      // Allow test-specific patterns
      'no-restricted-globals': 'off',
      'prefer-arrow-callback': 'off',
      'no-var': 'off',
      'vars-on-top': 'off',
      'no-undef': 'off',
      'no-use-before-define': 'off',
      'no-cond-assign': 'off',
      'no-sparse-arrays': 'off',
      'no-fallthrough': 'off',
      'prefer-rest-params': 'off',
      'no-throw-literal': 'off',
      'new-cap': 'off',
      'object-shorthand': 'off',
    },
  }, ...userConfigs);
}
