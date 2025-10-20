
    INSERT INTO skills (
      id, slug, name, description, category, zip_key, image_key,
      examples, curator_note, author, author_kind,
      source_type, source_url, created_at, updated_at
    ) VALUES (
      '0b4d24e7-3946-4dfa-80fa-f354fbbb7cc1',
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
      1760955342,
      1760955342
    );

    INSERT INTO skill_stats (skill_id, download_count)
    VALUES ('0b4d24e7-3946-4dfa-80fa-f354fbbb7cc1', 0);
  