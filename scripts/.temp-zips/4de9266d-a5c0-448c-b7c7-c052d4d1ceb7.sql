
    INSERT OR IGNORE INTO skills (
      id, slug, name, description, category, zip_key, image_key,
      examples, curator_note, author, author_kind,
      source_type, source_url, created_at, updated_at
    ) VALUES (
      '4de9266d-a5c0-448c-b7c7-c052d4d1ceb7',
      'theme-factory',
      'theme-factory',
      'Toolkit for styling artifacts with a theme. These artifacts can be slides, docs, reportings, HTML landing pages, etc. There are 10 pre-set themes with colors/fonts that you can apply to any artifact that has been creating, or can generate a new theme on-the-fly.',
      'Design',
      'skills/theme-factory.zip',
      'images/theme-factory.png',
      '["Create a VSCode theme with dark mode aesthetics","Generate a color scheme for a code editor","Design a theme inspired by nature"]',
      NULL,
      'anthropic',
      'verified',
      'import',
      'https://github.com/anthropics/skills/tree/main/theme-factory',
      1760969667,
      1760969667
    );

    INSERT OR IGNORE INTO skill_stats (skill_id, download_count)
    VALUES ('4de9266d-a5c0-448c-b7c7-c052d4d1ceb7', 0);
  