import JSZip from 'jszip';
import matter from 'gray-matter';

/**
 * Create a skill ZIP package from user inputs
 *
 * Package structure:
 * skill-name.zip
 * ├── SKILL.md (with frontmatter)
 * ├── metadata.json
 * └── [additional files...]
 *
 * @param skillMdContent - SKILL.md content with frontmatter
 * @param additionalFiles - Optional scripts, resources, templates
 * @param metadata - Author, sourceUrl, examples, etc.
 * @returns ZIP file as Blob
 */
export interface SkillMetadata {
  author: string;
  authorKind: 'community' | 'verified';
  sourceType: 'submission';
  sourceUrl: string;
  examples: string[];
  curatorNote?: string | null;
}

/**
 * Sanitize file name to prevent path traversal and invalid characters
 * Removes: ../, ..\, absolute paths, control characters
 * Preserves: alphanumeric, dots, hyphens, underscores
 */
export function sanitizeFileName(fileName: string): string {
  // Remove any path components (get just the file name)
  const baseName = fileName.split('/').pop()?.split('\\').pop() || 'unnamed';

  // Remove or replace dangerous characters
  return baseName
    .replace(/\.\./g, '_') // Replace .. with _
    .replace(/[/\\]/g, '_') // Replace slashes with _
    .replace(/[^\w.-]/g, '_') // Replace non-word chars (except . - _) with _
    .replace(/^\.+/, '_') // Don't allow files starting with dots
    .slice(0, 255); // Limit length to filesystem max
}

export async function createSkillZip(
  skillMdContent: string,
  additionalFiles: File[],
  metadata: SkillMetadata,
): Promise<Blob> {
  const zip = new JSZip();

  // 1. Add SKILL.md
  zip.file('SKILL.md', skillMdContent);

  // 2. Add metadata.json
  const metadataJson = {
    author: metadata.author,
    authorKind: metadata.authorKind,
    sourceType: metadata.sourceType,
    sourceUrl: metadata.sourceUrl,
    examples: metadata.examples,
    curatorNote: metadata.curatorNote || null,
  };
  zip.file('metadata.json', JSON.stringify(metadataJson, null, 2));

  // 3. Add additional files (scripts, resources, templates)
  // Sanitize file names to prevent path traversal attacks
  for (const file of additionalFiles) {
    const fileContent = await file.arrayBuffer();
    const safeName = sanitizeFileName(file.name);
    zip.file(safeName, fileContent);
  }

  // 4. Generate ZIP blob
  const zipBlob = await zip.generateAsync({ type: 'blob' });
  return zipBlob;
}

/**
 * Parse SKILL.md frontmatter to extract metadata
 */
export function parseSkillFrontmatter(skillMdContent: string): {
  name: string;
  description: string;
  license: string;
  allowedTools: string;
} {
  const { data } = matter(skillMdContent);

  return {
    name: data.name || '',
    description: data.description || '',
    license: data.license || 'MIT',
    allowedTools: data['allowed-tools'] || '',
  };
}

/**
 * Validate SKILL.md has required frontmatter
 */
export function validateSkillMd(skillMdContent: string): {
  valid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  try {
    const { data } = matter(skillMdContent);

    if (!data.name || typeof data.name !== 'string') {
      errors.push('Missing or invalid "name" in frontmatter');
    }

    if (!data.description || typeof data.description !== 'string') {
      errors.push('Missing or invalid "description" in frontmatter');
    }

    if (!data.license || typeof data.license !== 'string') {
      errors.push('Missing or invalid "license" in frontmatter');
    }

    if (!data['allowed-tools'] || typeof data['allowed-tools'] !== 'string') {
      errors.push('Missing or invalid "allowed-tools" in frontmatter');
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  }
  catch (error) {
    return {
      valid: false,
      errors: ['Failed to parse SKILL.md frontmatter. Ensure it starts and ends with "---"'],
    };
  }
}
