
    INSERT INTO skills (
      id, slug, name, description, category, zip_key, image_key,
      examples, curator_note, author, author_kind,
      source_type, source_url, created_at, updated_at
    ) VALUES (
      'e41b350b-27ad-46bf-b71c-273158b67175',
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
      1760953773,
      1760953773
    );

    INSERT INTO skill_stats (skill_id, download_count)
    VALUES ('e41b350b-27ad-46bf-b71c-273158b67175', 0);
  