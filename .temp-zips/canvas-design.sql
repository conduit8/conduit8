
    INSERT INTO skills (
      id, name, description, category, zip_key, image_key,
      examples, curator_note, author, author_kind,
      source_type, source_url, created_at, updated_at
    ) VALUES (
      'canvas-design',
      'canvas-design',
      'Create beautiful visual art in .png and .pdf documents using design philosophy. You should use this skill when the user asks to create a poster, piece of art, design, or other static piece. Create original visual designs, never copying existing artists'' work to avoid copyright violations.',
      NULL,
      'skills/canvas-design.zip',
      'images/canvas-design.png',
      '[]',
      NULL,
      'anthropic',
      'official',
      'import',
      'https://github.com/anthropics/skills/tree/main/canvas-design',
      1760898246,
      1760898246
    );

    INSERT INTO skill_stats (skill_id, download_count)
    VALUES ('canvas-design', 0);
  