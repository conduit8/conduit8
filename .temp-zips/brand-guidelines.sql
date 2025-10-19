
    INSERT INTO skills (
      id, name, description, category, zip_key, image_key,
      examples, curator_note, author, author_kind,
      source_type, source_url, created_at, updated_at
    ) VALUES (
      'brand-guidelines',
      'brand-guidelines',
      'Applies Anthropic''s official brand colors and typography to any sort of artifact that may benefit from having Anthropic''s look-and-feel. Use it when brand colors or style guidelines, visual formatting, or company design standards apply.',
      NULL,
      'skills/brand-guidelines.zip',
      'images/brand-guidelines.png',
      '[]',
      NULL,
      'anthropic',
      'official',
      'import',
      'https://github.com/anthropics/skills/tree/main/brand-guidelines',
      1760898242,
      1760898242
    );

    INSERT INTO skill_stats (skill_id, download_count)
    VALUES ('brand-guidelines', 0);
  