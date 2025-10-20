
    INSERT INTO skills (
      id, slug, name, description, category, zip_key, image_key,
      examples, curator_note, author, author_kind,
      source_type, source_url, created_at, updated_at
    ) VALUES (
      'c60a9267-4e14-4c8c-acc1-f60869cafb34',
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
      1760955373,
      1760955373
    );

    INSERT INTO skill_stats (skill_id, download_count)
    VALUES ('c60a9267-4e14-4c8c-acc1-f60869cafb34', 0);
  