INSERT OR IGNORE INTO skills (
  id, slug, name, description, category, zip_key, image_key,
  examples, curator_note, author, author_kind,
  source_type, source_url, created_at, updated_at
) VALUES (
  'b441bb5e-c006-4162-8fe3-90d06b488e2e',
  'skill-creator',
  'skill-creator',
  'Guide for creating effective skills. This skill should be used when users want to create a new skill (or update an existing skill) that extends Claude''s capabilities with specialized knowledge, workflows, or tool integrations.',
  'Development',
  'skills/skill-creator.zip',
  'images/skill-creator.png',
  '["Create a new Claude Code skill for API documentation","Build a skill for automated testing workflows","Design a skill template for data analysis"]',
  NULL,
  'anthropic',
  'verified',
  'import',
  'https://github.com/anthropics/skills/tree/main/skill-creator',
  1760970205,
  1760970205
);

INSERT OR IGNORE INTO skill_stats (skill_id, download_count)
VALUES ('b441bb5e-c006-4162-8fe3-90d06b488e2e', 0);
