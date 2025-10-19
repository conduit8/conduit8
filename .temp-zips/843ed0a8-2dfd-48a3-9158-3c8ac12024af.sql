
    INSERT INTO skills (
      id, slug, name, description, category, zip_key, image_key,
      examples, curator_note, author, author_kind,
      source_type, source_url, created_at, updated_at
    ) VALUES (
      '843ed0a8-2dfd-48a3-9158-3c8ac12024af',
      'artifacts-builder',
      'artifacts-builder',
      'Suite of tools for creating elaborate, multi-component claude.ai HTML artifacts using modern frontend web technologies (React, Tailwind CSS, shadcn/ui). Use for complex artifacts requiring state management, routing, or shadcn/ui components - not for simple single-file HTML/JSX artifacts.',
      NULL,
      'skills/artifacts-builder.zip',
      'images/artifacts-builder.png',
      '[]',
      NULL,
      'anthropic',
      'verified',
      'import',
      'https://github.com/anthropics/skills/tree/main/artifacts-builder',
      1760900725,
      1760900725
    );

    INSERT INTO skill_stats (skill_id, download_count)
    VALUES ('843ed0a8-2dfd-48a3-9158-3c8ac12024af', 0);
  