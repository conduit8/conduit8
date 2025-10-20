
    INSERT OR IGNORE INTO skills (
      id, slug, name, description, category, zip_key, image_key,
      examples, curator_note, author, author_kind,
      source_type, source_url, created_at, updated_at
    ) VALUES (
      'b27c265b-43c7-4862-a47a-140f4dd9e4a9',
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
      1760969330,
      1760969330
    );

    INSERT OR IGNORE INTO skill_stats (skill_id, download_count)
    VALUES ('b27c265b-43c7-4862-a47a-140f4dd9e4a9', 0);
  