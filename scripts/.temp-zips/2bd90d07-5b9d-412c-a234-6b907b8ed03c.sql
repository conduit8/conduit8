INSERT OR IGNORE INTO skills (
  id, slug, name, description, category, zip_key, image_key,
  examples, curator_note, author, author_kind,
  source_type, source_url, created_at, updated_at
) VALUES (
  '2bd90d07-5b9d-412c-a234-6b907b8ed03c',
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
  1760970386,
  1760970386
);

INSERT OR IGNORE INTO skill_stats (skill_id, download_count)
VALUES ('2bd90d07-5b9d-412c-a234-6b907b8ed03c', 0);
