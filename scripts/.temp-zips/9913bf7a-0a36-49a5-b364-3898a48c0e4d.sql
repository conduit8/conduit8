INSERT OR IGNORE INTO skills (
  id, slug, name, description, category, zip_key, image_key,
  examples, curator_note, author, author_kind,
  source_type, source_url, created_at, updated_at
) VALUES (
  '9913bf7a-0a36-49a5-b364-3898a48c0e4d',
  'brand-guidelines',
  'brand-guidelines',
  'Applies Anthropic''s official brand colors and typography to any sort of artifact that may benefit from having Anthropic''s look-and-feel. Use it when brand colors or style guidelines, visual formatting, or company design standards apply.',
  'Content',
  'skills/brand-guidelines.zip',
  'images/brand-guidelines.png',
  '["Create comprehensive brand guidelines for a startup","Document visual identity standards","Write brand voice and tone guidelines"]',
  NULL,
  'anthropic',
  'verified',
  'import',
  'https://github.com/anthropics/skills/tree/main/brand-guidelines',
  1760970369,
  1760970369
);

INSERT OR IGNORE INTO skill_stats (skill_id, download_count)
VALUES ('9913bf7a-0a36-49a5-b364-3898a48c0e4d', 0);
