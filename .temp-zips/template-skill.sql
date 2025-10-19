
    INSERT INTO skills (
      id, name, description, category, zip_key, image_key,
      examples, curator_note, author, author_kind,
      source_type, source_url, created_at, updated_at
    ) VALUES (
      'template-skill',
      'template-skill',
      'Replace with description of the skill and when Claude should use it.',
      NULL,
      'skills/template-skill.zip',
      'images/template-skill.png',
      '[]',
      NULL,
      'anthropic',
      'official',
      'import',
      'https://github.com/anthropics/skills/tree/main/template-skill',
      1760898265,
      1760898265
    );

    INSERT INTO skill_stats (skill_id, download_count)
    VALUES ('template-skill', 0);
  