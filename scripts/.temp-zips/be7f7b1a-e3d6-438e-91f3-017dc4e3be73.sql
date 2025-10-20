
    INSERT INTO skills (
      id, slug, name, description, category, zip_key, image_key,
      examples, curator_note, author, author_kind,
      source_type, source_url, created_at, updated_at
    ) VALUES (
      'be7f7b1a-e3d6-438e-91f3-017dc4e3be73',
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
      1760955390,
      1760955390
    );

    INSERT INTO skill_stats (skill_id, download_count)
    VALUES ('be7f7b1a-e3d6-438e-91f3-017dc4e3be73', 0);
  