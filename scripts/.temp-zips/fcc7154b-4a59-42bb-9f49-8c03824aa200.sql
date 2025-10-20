INSERT OR IGNORE INTO skills (
  id, slug, name, description, category, zip_key, image_key,
  examples, curator_note, author, author_kind,
  source_type, source_url, created_at, updated_at
) VALUES (
  'fcc7154b-4a59-42bb-9f49-8c03824aa200',
  'internal-comms',
  'internal-comms',
  'A set of resources to help me write all kinds of internal communications, using the formats that my company likes to use. Claude should use this skill whenever asked to write some sort of internal communications (status reports, leadership updates, 3P updates, company newsletters, FAQs, incident reports, project updates, etc.).',
  'Content',
  'skills/internal-comms.zip',
  'images/internal-comms.png',
  '["Draft an internal company announcement","Create a team update email","Write an all-hands meeting summary"]',
  NULL,
  'anthropic',
  'verified',
  'import',
  'https://github.com/anthropics/skills/tree/main/internal-comms',
  1760970374,
  1760970374
);

INSERT OR IGNORE INTO skill_stats (skill_id, download_count)
VALUES ('fcc7154b-4a59-42bb-9f49-8c03824aa200', 0);
