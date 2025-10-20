INSERT OR IGNORE INTO skills (
  id, slug, name, description, category, zip_key, image_key,
  examples, curator_note, author, author_kind,
  source_type, source_url, created_at, updated_at
) VALUES (
  '44197681-af50-4212-9936-0b195cf2de4c',
  'webapp-testing',
  'webapp-testing',
  'Toolkit for interacting with and testing local web applications using Playwright. Supports verifying frontend functionality, debugging UI behavior, capturing browser screenshots, and viewing browser logs.',
  'Development',
  'skills/webapp-testing.zip',
  'images/webapp-testing.png',
  '["Test a local web application with Playwright","Verify frontend functionality and capture screenshots","Debug UI behavior and check browser logs"]',
  NULL,
  'anthropic',
  'verified',
  'import',
  'https://github.com/anthropics/skills/tree/main/webapp-testing',
  1760970222,
  1760970222
);

INSERT OR IGNORE INTO skill_stats (skill_id, download_count)
VALUES ('44197681-af50-4212-9936-0b195cf2de4c', 0);
