
    INSERT INTO skills (
      id, slug, name, description, category, zip_key, image_key,
      examples, curator_note, author, author_kind,
      source_type, source_url, created_at, updated_at
    ) VALUES (
      '5f925818-e44a-41fa-b36b-f2160f265d1a',
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
      1760955313,
      1760955313
    );

    INSERT INTO skill_stats (skill_id, download_count)
    VALUES ('5f925818-e44a-41fa-b36b-f2160f265d1a', 0);
  