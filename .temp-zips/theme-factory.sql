
    INSERT INTO skills (
      id, name, description, category, zip_key, image_key,
      examples, curator_note, author, author_kind,
      source_type, source_url, created_at, updated_at
    ) VALUES (
      'theme-factory',
      'theme-factory',
      'Toolkit for styling artifacts with a theme. These artifacts can be slides, docs, reportings, HTML landing pages, etc. There are 10 pre-set themes with colors/fonts that you can apply to any artifact that has been creating, or can generate a new theme on-the-fly.',
      NULL,
      'skills/theme-factory.zip',
      'images/theme-factory.png',
      '[]',
      NULL,
      'anthropic',
      'official',
      'import',
      'https://github.com/anthropics/skills/tree/main/theme-factory',
      1760898269,
      1760898269
    );

    INSERT INTO skill_stats (skill_id, download_count)
    VALUES ('theme-factory', 0);
  