
    INSERT INTO skills (
      id, slug, name, description, category, zip_key, image_key,
      examples, curator_note, author, author_kind,
      source_type, source_url, created_at, updated_at
    ) VALUES (
      '175d4298-d6b5-4b16-8283-7533af09d98f',
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
      1760953804,
      1760953804
    );

    INSERT INTO skill_stats (skill_id, download_count)
    VALUES ('175d4298-d6b5-4b16-8283-7533af09d98f', 0);
  