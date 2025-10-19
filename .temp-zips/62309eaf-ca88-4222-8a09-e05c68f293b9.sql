
    INSERT INTO skills (
      id, slug, name, description, category, zip_key, image_key,
      examples, curator_note, author, author_kind,
      source_type, source_url, created_at, updated_at
    ) VALUES (
      '62309eaf-ca88-4222-8a09-e05c68f293b9',
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
      1760900751,
      1760900751
    );

    INSERT INTO skill_stats (skill_id, download_count)
    VALUES ('62309eaf-ca88-4222-8a09-e05c68f293b9', 0);
  