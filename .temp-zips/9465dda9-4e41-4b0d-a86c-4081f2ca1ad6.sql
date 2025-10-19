
    INSERT INTO skills (
      id, slug, name, description, category, zip_key, image_key,
      examples, curator_note, author, author_kind,
      source_type, source_url, created_at, updated_at
    ) VALUES (
      '9465dda9-4e41-4b0d-a86c-4081f2ca1ad6',
      'internal-comms',
      'internal-comms',
      'A set of resources to help me write all kinds of internal communications, using the formats that my company likes to use. Claude should use this skill whenever asked to write some sort of internal communications (status reports, leadership updates, 3P updates, company newsletters, FAQs, incident reports, project updates, etc.).',
      NULL,
      'skills/internal-comms.zip',
      'images/internal-comms.png',
      '[]',
      NULL,
      'anthropic',
      'verified',
      'import',
      'https://github.com/anthropics/skills/tree/main/internal-comms',
      1760902625,
      1760902625
    );

    INSERT INTO skill_stats (skill_id, download_count)
    VALUES ('9465dda9-4e41-4b0d-a86c-4081f2ca1ad6', 0);
  