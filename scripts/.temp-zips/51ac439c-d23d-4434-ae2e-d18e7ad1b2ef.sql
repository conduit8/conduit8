INSERT OR IGNORE INTO skills (
  id, slug, name, description, category, zip_key, image_key,
  examples, curator_note, author, author_kind,
  source_type, source_url, created_at, updated_at
) VALUES (
  '51ac439c-d23d-4434-ae2e-d18e7ad1b2ef',
  'slack-gif-creator',
  'slack-gif-creator',
  'Toolkit for creating animated GIFs optimized for Slack, with validators for size constraints and composable animation primitives. This skill applies when users request animated GIFs or emoji animations for Slack from descriptions like "make me a GIF for Slack of X doing Y".',
  'Media',
  'skills/slack-gif-creator.zip',
  'images/slack-gif-creator.png',
  '["Create an animated GIF for Slack showing a loading spinner","Make a celebration GIF optimized for Slack's size constraints","Generate an emoji animation for Slack reactions"]',
  NULL,
  'anthropic',
  'verified',
  'import',
  'https://github.com/anthropics/skills/tree/main/slack-gif-creator',
  1760970211,
  1760970211
);

INSERT OR IGNORE INTO skill_stats (skill_id, download_count)
VALUES ('51ac439c-d23d-4434-ae2e-d18e7ad1b2ef', 0);
