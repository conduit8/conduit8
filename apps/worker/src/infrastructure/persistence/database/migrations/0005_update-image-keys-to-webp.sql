-- Custom SQL migration file, put your code below! --
-- Custom migration: Update all image_key values from .png to .webp
-- All skill cover images are now stored in WebP format for better compression

UPDATE skills
SET image_key = REPLACE(image_key, '.png', '.webp')
WHERE image_key LIKE '%.png';

-- Verification: Display updated image keys
SELECT slug, image_key
FROM skills
ORDER BY slug;
