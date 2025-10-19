
    INSERT INTO skills (
      id, name, description, category, zip_key, image_key,
      examples, curator_note, author, author_kind,
      source_type, source_url, created_at, updated_at
    ) VALUES (
      'internal-comms',
      'internal-comms',
      'A set of resources to help me write all kinds of internal communications, using the formats that my company likes to use. Claude should use this skill whenever asked to write some sort of internal communications (status reports, leadership updates, 3P updates, company newsletters, FAQs, incident reports, project updates, etc.).',
      NULL,
      'skills/internal-comms.zip',
      'images/internal-comms.png',
      '[]',
      NULL,
      'anthropic',
      'official',
      'import',
      'https://github.com/anthropics/skills/tree/main/internal-comms',
      1760898250,
      1760898250
    );

    INSERT INTO skill_stats (skill_id, download_count)
    VALUES ('internal-comms', 0);
  