
    INSERT INTO skills (
      id, name, description, category, zip_key, image_key,
      examples, curator_note, author, author_kind,
      source_type, source_url, created_at, updated_at
    ) VALUES (
      'webapp-testing',
      'webapp-testing',
      'Toolkit for interacting with and testing local web applications using Playwright. Supports verifying frontend functionality, debugging UI behavior, capturing browser screenshots, and viewing browser logs.',
      NULL,
      'skills/webapp-testing.zip',
      'images/webapp-testing.png',
      '[]',
      NULL,
      'anthropic',
      'official',
      'import',
      'https://github.com/anthropics/skills/tree/main/webapp-testing',
      1760898272,
      1760898272
    );

    INSERT INTO skill_stats (skill_id, download_count)
    VALUES ('webapp-testing', 0);
  