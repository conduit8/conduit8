
    INSERT INTO skills (
      id, slug, name, description, category, zip_key, image_key,
      examples, curator_note, author, author_kind,
      source_type, source_url, created_at, updated_at
    ) VALUES (
      '22de9ea9-b839-4a73-b678-4027642d9fc7',
      'canvas-design',
      'canvas-design',
      'Create beautiful visual art in .png and .pdf documents using design philosophy. You should use this skill when the user asks to create a poster, piece of art, design, or other static piece. Create original visual designs, never copying existing artists'' work to avoid copyright violations.',
      NULL,
      'skills/canvas-design.zip',
      'images/canvas-design.png',
      '[]',
      NULL,
      'anthropic',
      'verified',
      'import',
      'https://github.com/anthropics/skills/tree/main/canvas-design',
      1760902621,
      1760902621
    );

    INSERT INTO skill_stats (skill_id, download_count)
    VALUES ('22de9ea9-b839-4a73-b678-4027642d9fc7', 0);
  