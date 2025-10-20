
    INSERT INTO skills (
      id, slug, name, description, category, zip_key, image_key,
      examples, curator_note, author, author_kind,
      source_type, source_url, created_at, updated_at
    ) VALUES (
      '9ddf330a-7401-4503-9dcd-9346237a9401',
      'slack-gif-creator',
      'slack-gif-creator',
      'Toolkit for creating animated GIFs optimized for Slack, with validators for size constraints and composable animation primitives. This skill applies when users request animated GIFs or emoji animations for Slack from descriptions like "make me a GIF for Slack of X doing Y".',
      NULL,
      'skills/slack-gif-creator.zip',
      'images/slack-gif-creator.png',
      '[]',
      NULL,
      'anthropic',
      'verified',
      'import',
      'https://github.com/anthropics/skills/tree/main/slack-gif-creator',
      1760953792,
      1760953792
    );

    INSERT INTO skill_stats (skill_id, download_count)
    VALUES ('9ddf330a-7401-4503-9dcd-9346237a9401', 0);
  