
    INSERT INTO skills (
      id, slug, name, description, category, zip_key, image_key,
      examples, curator_note, author, author_kind,
      source_type, source_url, created_at, updated_at
    ) VALUES (
      'ef8ff348-a148-4869-bea9-38ac61050bfe',
      'template-skill',
      'template-skill',
      'Replace with description of the skill and when Claude should use it.',
      NULL,
      'skills/template-skill.zip',
      'images/template-skill.png',
      '[]',
      NULL,
      'anthropic',
      'verified',
      'import',
      'https://github.com/anthropics/skills/tree/main/template-skill',
      1760953796,
      1760953796
    );

    INSERT INTO skill_stats (skill_id, download_count)
    VALUES ('ef8ff348-a148-4869-bea9-38ac61050bfe', 0);
  