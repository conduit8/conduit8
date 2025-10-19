
    INSERT INTO skills (
      id, slug, name, description, category, zip_key, image_key,
      examples, curator_note, author, author_kind,
      source_type, source_url, created_at, updated_at
    ) VALUES (
      '52cd8ac6-7250-4e8b-92ee-358ddb3143fe',
      'skill-creator',
      'skill-creator',
      'Guide for creating effective skills. This skill should be used when users want to create a new skill (or update an existing skill) that extends Claude''s capabilities with specialized knowledge, workflows, or tool integrations.',
      NULL,
      'skills/skill-creator.zip',
      'images/skill-creator.png',
      '[]',
      NULL,
      'anthropic',
      'verified',
      'import',
      'https://github.com/anthropics/skills/tree/main/skill-creator',
      1760902632,
      1760902632
    );

    INSERT INTO skill_stats (skill_id, download_count)
    VALUES ('52cd8ac6-7250-4e8b-92ee-358ddb3143fe', 0);
  