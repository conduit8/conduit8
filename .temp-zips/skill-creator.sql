
    INSERT INTO skills (
      id, name, description, category, zip_key, image_key,
      examples, curator_note, author, author_kind,
      source_type, source_url, created_at, updated_at
    ) VALUES (
      'skill-creator',
      'skill-creator',
      'Guide for creating effective skills. This skill should be used when users want to create a new skill (or update an existing skill) that extends Claude''s capabilities with specialized knowledge, workflows, or tool integrations.',
      NULL,
      'skills/skill-creator.zip',
      'images/skill-creator.png',
      '[]',
      NULL,
      'anthropic',
      'official',
      'import',
      'https://github.com/anthropics/skills/tree/main/skill-creator',
      1760898257,
      1760898257
    );

    INSERT INTO skill_stats (skill_id, download_count)
    VALUES ('skill-creator', 0);
  