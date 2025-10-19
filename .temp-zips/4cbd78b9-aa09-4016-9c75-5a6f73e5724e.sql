
    INSERT INTO skills (
      id, slug, name, description, category, zip_key, image_key,
      examples, curator_note, author, author_kind,
      source_type, source_url, created_at, updated_at
    ) VALUES (
      '4cbd78b9-aa09-4016-9c75-5a6f73e5724e',
      'brand-guidelines',
      'brand-guidelines',
      'Applies Anthropic''s official brand colors and typography to any sort of artifact that may benefit from having Anthropic''s look-and-feel. Use it when brand colors or style guidelines, visual formatting, or company design standards apply.',
      NULL,
      'skills/brand-guidelines.zip',
      'images/brand-guidelines.png',
      '[]',
      NULL,
      'anthropic',
      'verified',
      'import',
      'https://github.com/anthropics/skills/tree/main/brand-guidelines',
      1760900728,
      1760900728
    );

    INSERT INTO skill_stats (skill_id, download_count)
    VALUES ('4cbd78b9-aa09-4016-9c75-5a6f73e5724e', 0);
  