
    INSERT INTO skills (
      id, slug, name, description, category, zip_key, image_key,
      examples, curator_note, author, author_kind,
      source_type, source_url, created_at, updated_at
    ) VALUES (
      'a0020df0-a108-4337-959c-0ccd04834857',
      'webapp-testing',
      'webapp-testing',
      'Toolkit for interacting with and testing local web applications using Playwright. Supports verifying frontend functionality, debugging UI behavior, capturing browser screenshots, and viewing browser logs.',
      NULL,
      'skills/webapp-testing.zip',
      'images/webapp-testing.png',
      '[]',
      NULL,
      'anthropic',
      'verified',
      'import',
      'https://github.com/anthropics/skills/tree/main/webapp-testing',
      1760902646,
      1760902646
    );

    INSERT INTO skill_stats (skill_id, download_count)
    VALUES ('a0020df0-a108-4337-959c-0ccd04834857', 0);
  