INSERT OR IGNORE INTO skills (
  id, slug, name, description, category, zip_key, image_key,
  examples, curator_note, author, author_kind,
  source_type, source_url, created_at, updated_at
) VALUES (
  '845f4d2c-f044-4576-9f95-e527a707f070',
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
  1760970381,
  1760970381
);

INSERT OR IGNORE INTO skill_stats (skill_id, download_count)
VALUES ('845f4d2c-f044-4576-9f95-e527a707f070', 0);
