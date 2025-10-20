
    INSERT INTO skills (
      id, slug, name, description, category, zip_key, image_key,
      examples, curator_note, author, author_kind,
      source_type, source_url, created_at, updated_at
    ) VALUES (
      '44b2570d-da20-4517-b433-961201913249',
      'algorithmic-art',
      'algorithmic-art',
      'Creating algorithmic art using p5.js with seeded randomness and interactive parameter exploration. Use this when users request creating art using code, generative art, algorithmic art, flow fields, or particle systems. Create original algorithmic art rather than copying existing artists'' work to avoid copyright violations.',
      NULL,
      'skills/algorithmic-art.zip',
      'images/algorithmic-art.png',
      '[]',
      NULL,
      'anthropic',
      'verified',
      'import',
      'https://github.com/anthropics/skills/tree/main/algorithmic-art',
      1760953765,
      1760953765
    );

    INSERT INTO skill_stats (skill_id, download_count)
    VALUES ('44b2570d-da20-4517-b433-961201913249', 0);
  