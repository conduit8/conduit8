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
  for (const file of additionalFiles) {
    const fileContent = await file.arrayBuffer();
    zip.file(file.name, fileContent);
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
