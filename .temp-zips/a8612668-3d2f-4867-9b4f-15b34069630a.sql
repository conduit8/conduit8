
    INSERT INTO skills (
      id, slug, name, description, category, zip_key, image_key,
      examples, curator_note, author, author_kind,
      source_type, source_url, created_at, updated_at
    ) VALUES (
      'a8612668-3d2f-4867-9b4f-15b34069630a',
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
      1760900743,
      1760900743
    );

    INSERT INTO skill_stats (skill_id, download_count)
    VALUES ('a8612668-3d2f-4867-9b4f-15b34069630a', 0);
  