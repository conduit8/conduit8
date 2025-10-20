
    INSERT INTO skills (
      id, slug, name, description, category, zip_key, image_key,
      examples, curator_note, author, author_kind,
      source_type, source_url, created_at, updated_at
    ) VALUES (
      '2fff2918-d60a-438e-b351-7ea29edb159f',
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
      1760953788,
      1760953788
    );

    INSERT INTO skill_stats (skill_id, download_count)
    VALUES ('2fff2918-d60a-438e-b351-7ea29edb159f', 0);
  