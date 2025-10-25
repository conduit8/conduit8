// Polyfill Buffer for gray-matter (expects Node.js Buffer global)
import { Buffer } from 'buffer';
if (typeof globalThis.Buffer === 'undefined') {
  globalThis.Buffer = Buffer;
}

import matter from 'gray-matter';
import JSZip from 'jszip';

import type { SkillFrontmatter } from '../components/submit-skill-dialog/submit-skill-form.schema';

/**
 * Parsed ZIP file information
 */
export interface ParsedSkillZip {
  skillMd: {
    content: string;
    frontmatter: SkillFrontmatter;
    excerpt: string; // First 200 chars of body
  };
  files: {
    name: string;
    size: number;
  }[];
  totalSize: number;
}

/**
 * Parse uploaded skill ZIP file
 * Extracts SKILL.md frontmatter and file list
 */
export async function parseSkillZip(zipFile: File): Promise<ParsedSkillZip> {
  try {
    // Load ZIP
    const zip = await JSZip.loadAsync(zipFile);

    // Debug: Log all files in ZIP
    const allFiles = Object.keys(zip.files);
    console.log('[parseSkillZip] Files in ZIP:', allFiles);

    // Find all SKILL.md files (case-insensitive)
    const skillMdFiles = allFiles.filter((path) => {
      const fileName = path.split('/').pop() || '';
      return fileName.toUpperCase() === 'SKILL.MD';
    });

    console.log('[parseSkillZip] Found SKILL.md files:', skillMdFiles);

    // Validate: exactly one SKILL.md
    if (skillMdFiles.length === 0) {
      throw new Error(`ZIP must contain exactly one SKILL.md file. Found files: ${allFiles.join(', ')}`);
    }

    if (skillMdFiles.length > 1) {
      throw new Error(`ZIP must contain exactly one SKILL.md file. Found ${skillMdFiles.length}: ${skillMdFiles.join(', ')}`);
    }

    const skillMdPath = skillMdFiles[0];
    const skillMdFile = zip.file(skillMdPath);

    if (!skillMdFile) {
      throw new Error('Failed to read SKILL.md file from ZIP');
    }

    console.log('[parseSkillZip] Using SKILL.md from:', skillMdPath);

    // Extract SKILL.md content
    const skillMdContent = await (skillMdFile as JSZip.JSZipObject).async('text');

    // Parse frontmatter
    const { data: frontmatter, content: body } = matter(skillMdContent);

    console.log('[parseSkillZip] Parsed frontmatter:', frontmatter);

    // Validate required frontmatter fields
    if (!frontmatter.name || !frontmatter.description) {
      throw new Error('SKILL.md must contain name and description in frontmatter');
    }

    // Extract first 200 chars of body for preview
    const excerpt = body.trim().slice(0, 200) + (body.length > 200 ? '...' : '');

    // Get file list (exclude directories)
    const files = Object.keys(zip.files)
      .filter((path) => {
        const file = zip.files[path];
        return file && !file.dir;
      })
      .map((path) => {
        return {
          name: path,
          size: 0, // Size not available from JSZip without reading each file
        };
      })
      .sort((a, b) => a.name.localeCompare(b.name));

    // Validate max files (prevent excessive file uploads)
    const MAX_FILES = 100;
    if (files.length > MAX_FILES) {
      throw new Error(`ZIP contains too many files. Maximum ${MAX_FILES} files allowed, found ${files.length}.`);
    }

    return {
      skillMd: {
        content: skillMdContent,
        frontmatter: frontmatter as SkillFrontmatter,
        excerpt,
      },
      files,
      totalSize: zipFile.size,
    };
  }
  catch (error) {
    console.error('[parseSkillZip] Error parsing ZIP:', error);

    // Handle Buffer not defined error from gray-matter
    if (error instanceof ReferenceError && error.message.includes('Buffer')) {
      throw new Error('Failed to parse ZIP file: Browser compatibility issue. Please ensure your ZIP is valid.');
    }

    // Re-throw with better context
    if (error instanceof Error) {
      throw error;
    }

    throw new Error('Failed to parse ZIP file');
  }
}
