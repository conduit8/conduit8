
    INSERT OR IGNORE INTO skills (
      id, slug, name, description, category, zip_key, image_key,
      examples, curator_note, author, author_kind,
      source_type, source_url, created_at, updated_at
    ) VALUES (
      '4c4dac09-92f8-4612-a8e1-9c40abbc3ec7',
      'artifacts-builder',
      'artifacts-builder',
      'Suite of tools for creating elaborate, multi-component claude.ai HTML artifacts using modern frontend web technologies (React, Tailwind CSS, shadcn/ui). Use for complex artifacts requiring state management, routing, or shadcn/ui components - not for simple single-file HTML/JSX artifacts.',
      'Development',
      'skills/artifacts-builder.zip',
      'images/artifacts-builder.png',
      '["Create an interactive data visualization artifact","Build a React component sandbox","Generate a self-contained HTML demo"]',
      NULL,
      'anthropic',
      'verified',
      'import',
      'https://github.com/anthropics/skills/tree/main/artifacts-builder',
      1760969572,
      1760969572
    );

    INSERT OR IGNORE INTO skill_stats (skill_id, download_count)
    VALUES ('4c4dac09-92f8-4612-a8e1-9c40abbc3ec7', 0);
  