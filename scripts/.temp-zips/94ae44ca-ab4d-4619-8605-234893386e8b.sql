
    INSERT INTO skills (
      id, slug, name, description, category, zip_key, image_key,
      examples, curator_note, author, author_kind,
      source_type, source_url, created_at, updated_at
    ) VALUES (
      '94ae44ca-ab4d-4619-8605-234893386e8b',
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
      1760955320,
      1760955320
    );

    INSERT INTO skill_stats (skill_id, download_count)
    VALUES ('94ae44ca-ab4d-4619-8605-234893386e8b', 0);
  