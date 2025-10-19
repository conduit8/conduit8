
    INSERT INTO skills (
      id, slug, name, description, category, zip_key, image_key,
      examples, curator_note, author, author_kind,
      source_type, source_url, created_at, updated_at
    ) VALUES (
      'c969ac35-b6f5-47b4-b1d2-7d38b400a842',
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
      1760902639,
      1760902639
    );

    INSERT INTO skill_stats (skill_id, download_count)
    VALUES ('c969ac35-b6f5-47b4-b1d2-7d38b400a842', 0);
  