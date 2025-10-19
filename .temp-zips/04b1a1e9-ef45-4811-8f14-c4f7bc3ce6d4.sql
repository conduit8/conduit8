
    INSERT INTO skills (
      id, slug, name, description, category, zip_key, image_key,
      examples, curator_note, author, author_kind,
      source_type, source_url, created_at, updated_at
    ) VALUES (
      '04b1a1e9-ef45-4811-8f14-c4f7bc3ce6d4',
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
      1760900721,
      1760900721
    );

    INSERT INTO skill_stats (skill_id, download_count)
    VALUES ('04b1a1e9-ef45-4811-8f14-c4f7bc3ce6d4', 0);
  