import createConfig from '@conduit8/eslint-config/create-config';
import drizzle from 'eslint-plugin-drizzle';

export default createConfig(
  {
    ignores: [
      '**/migrations/**', // Database migration files
      'public/**', // Static public assets (HTML, favicons, etc.)
    ],
  },
  // Drizzle plugin for ORM-specific rules
  {
    plugins: { drizzle },
    rules: {
      ...drizzle.configs.recommended.rules,
      // Disable - too many false positives with Cloudflare APIs (KV, R2, DO storage)
      'drizzle/enforce-delete-with-where': 'off',
    },
  },
  // Drizzle-specific relaxed rules for test files
  {
    files: ['**/*.test.*', '**/*.spec.*', '**/test/**', '**/tests/**', '**/__tests__/**'],
    rules: {
      // Allow delete without where in tests (for cleanup)
      'drizzle/enforce-delete-with-where': 'off',
    },
  },
);
