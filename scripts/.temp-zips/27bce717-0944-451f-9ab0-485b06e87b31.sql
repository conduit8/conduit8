
    INSERT INTO skills (
      id, slug, name, description, category, zip_key, image_key,
      examples, curator_note, author, author_kind,
      source_type, source_url, created_at, updated_at
    ) VALUES (
      '27bce717-0944-451f-9ab0-485b06e87b31',
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
      1760955357,
      1760955357
    );

    INSERT INTO skill_stats (skill_id, download_count)
    VALUES ('27bce717-0944-451f-9ab0-485b06e87b31', 0);
  