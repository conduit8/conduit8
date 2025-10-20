INSERT OR IGNORE INTO skills (
  id, slug, name, description, category, zip_key, image_key,
  examples, curator_note, author, author_kind,
  source_type, source_url, created_at, updated_at
) VALUES (
  '9192932a-1661-414e-9e41-cb4952451c99',
  'canvas-design',
  'canvas-design',
  'Create beautiful visual art in .png and .pdf documents using design philosophy. You should use this skill when the user asks to create a poster, piece of art, design, or other static piece. Create original visual designs, never copying existing artists'' work to avoid copyright violations.',
  'Design',
  'skills/canvas-design.zip',
  'images/canvas-design.png',
  '["Create a poster for a tech conference","Design a minimalist artwork in PDF format","Make a visual design for a product launch"]',
  NULL,
  'anthropic',
  'verified',
  'import',
  'https://github.com/anthropics/skills/tree/main/canvas-design',
  1760970372,
  1760970372
);

INSERT OR IGNORE INTO skill_stats (skill_id, download_count)
VALUES ('9192932a-1661-414e-9e41-cb4952451c99', 0);
