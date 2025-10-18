import createConfig from '@kollektiv/eslint-config/create-config';
import tanstackQuery from '@tanstack/eslint-plugin-query';

export default createConfig(
  {
    react: true, // Enable React support in antfu config
    ignores: [
      '.tanstack/**', // Generated TanStack Router files
      '.storybook/**', // Storybook config files
      '**/*.stories.*', // Story files
    ],
  },
  // React-specific rules for this app
  {
    plugins: {
      '@tanstack/query': tanstackQuery,
    },
    rules: {
      // allow arrow functions
      'antfu/top-level-function': 'off',
      // React Refresh rule (plugin provided by antfu config when react: true)
      'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],

      // React Hooks rules (provided by antfu config when react: true)
      'react-hooks/exhaustive-deps': 'error', // Bug risk - upgrade to error

      // React performance rules
      'react/no-unstable-context-value': 'error', // Performance issue - upgrade to error

      // React best practices
      'react/no-array-index-key': 'error', // Can cause rendering bugs - upgrade to error
      'react/no-unstable-default-props': 'error', // Array/object as default props causes new references on every render

      // React DOM security and correctness
      'react-dom/no-missing-button-type': 'error', // Missing button type can cause form submission issues

      // React Hooks performance
      'react-hooks-extra/no-direct-set-state-in-use-effect': 'warn', // Can cause unnecessary re-renders and performance issues

      // TanStack Query rules
      '@tanstack/query/exhaustive-deps': 'error',
    },
    settings: {
      react: {
        version: 'detect',
      },
    },
  },
  // React-specific relaxed rules for test files
  {
    files: [
      '**/*.test.*',
      '**/*.spec.*',
      '**/test/**',
      '**/tests/**',
      '**/__tests__/**',
      '**/*.stories.*',
      '.storybook/**',
    ],
    rules: {
      // React specific test relaxations
      'react/no-array-index-key': 'off',
      'react-dom/no-missing-button-type': 'off',
      'react-hooks/exhaustive-deps': 'off',
      '@tanstack/query/exhaustive-deps': 'off',
      'react-refresh/only-export-components': 'off',
    },
  },
);
