-- Custom migration: Map old skill categories to new MECE categories
-- This migration transforms existing category values to align with the new domain model

UPDATE skills SET category = CASE
  -- Design: Generative art, visual design, media, creative
  WHEN category IN ('Generative Art', 'Design', 'creative', 'Media', 'media') THEN 'design'

  -- Development: Code development, testing, security, DevOps
  WHEN category IN ('Development', 'development', 'testing', 'devops', 'Security') THEN 'development'

  -- Content: Writing, communications, research, brand
  WHEN category IN ('Content', 'Research') THEN 'content'

  -- Documents: Office file formats (PDF, DOCX, PPTX, XLSX)
  WHEN category = 'documents' THEN 'documents'

  -- Data: Analysis, CSV processing, data manipulation
  WHEN category IN ('Data', 'data') THEN 'data'

  -- Marketing: SEO, landing pages, conversion optimization
  WHEN category = 'Marketing' THEN 'marketing'

  -- Business: Strategy, pitch decks, business operations
  WHEN category = 'Business' THEN 'business'

  -- Fallback: Default to development for any unexpected values
  ELSE 'development'
END;

-- Verification: Display category distribution after migration
SELECT category, COUNT(*) as count
FROM skills
GROUP BY category
ORDER BY category;
