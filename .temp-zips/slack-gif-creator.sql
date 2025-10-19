
    INSERT INTO skills (
      id, name, description, category, zip_key, image_key,
      examples, curator_note, author, author_kind,
      source_type, source_url, created_at, updated_at
    ) VALUES (
      'slack-gif-creator',
      'slack-gif-creator',
      'Toolkit for creating animated GIFs optimized for Slack, with validators for size constraints and composable animation primitives. This skill applies when users request animated GIFs or emoji animations for Slack from descriptions like "make me a GIF for Slack of X doing Y".',
      NULL,
      'skills/slack-gif-creator.zip',
      'images/slack-gif-creator.png',
      '[]',
      NULL,
      'anthropic',
      'official',
      'import',
      'https://github.com/anthropics/skills/tree/main/slack-gif-creator',
      1760898261,
      1760898261
    );

    INSERT INTO skill_stats (skill_id, download_count)
    VALUES ('slack-gif-creator', 0);
  