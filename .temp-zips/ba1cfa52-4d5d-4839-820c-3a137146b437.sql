
    INSERT INTO skills (
      id, slug, name, description, category, zip_key, image_key,
      examples, curator_note, author, author_kind,
      source_type, source_url, created_at, updated_at
    ) VALUES (
      'ba1cfa52-4d5d-4839-820c-3a137146b437',
      'theme-factory',
      'theme-factory',
      'Toolkit for styling artifacts with a theme. These artifacts can be slides, docs, reportings, HTML landing pages, etc. There are 10 pre-set themes with colors/fonts that you can apply to any artifact that has been creating, or can generate a new theme on-the-fly.',
      NULL,
      'skills/theme-factory.zip',
      'images/theme-factory.png',
      '[]',
      NULL,
      'anthropic',
      'verified',
      'import',
      'https://github.com/anthropics/skills/tree/main/theme-factory',
      1760902643,
      1760902643
    );

    INSERT INTO skill_stats (skill_id, download_count)
    VALUES ('ba1cfa52-4d5d-4839-820c-3a137146b437', 0);
  