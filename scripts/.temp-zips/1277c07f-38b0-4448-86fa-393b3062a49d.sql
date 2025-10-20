
    INSERT OR IGNORE INTO skills (
      id, slug, name, description, category, zip_key, image_key,
      examples, curator_note, author, author_kind,
      source_type, source_url, created_at, updated_at
    ) VALUES (
      '1277c07f-38b0-4448-86fa-393b3062a49d',
      'algorithmic-art',
      'algorithmic-art',
      'Creating algorithmic art using p5.js with seeded randomness and interactive parameter exploration. Use this when users request creating art using code, generative art, algorithmic art, flow fields, or particle systems. Create original algorithmic art rather than copying existing artists'' work to avoid copyright violations.',
      'Generative Art',
      'skills/algorithmic-art.zip',
      'images/algorithmic-art.png',
      '["Create algorithmic art exploring organic turbulence","Generate a flow field visualization with particle systems","Make generative art using recursive patterns"]',
      NULL,
      'anthropic',
      'verified',
      'import',
      'https://github.com/anthropics/skills/tree/main/algorithmic-art',
      1760969561,
      1760969561
    );

    INSERT OR IGNORE INTO skill_stats (skill_id, download_count)
    VALUES ('1277c07f-38b0-4448-86fa-393b3062a49d', 0);
  