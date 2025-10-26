import { SkillFrontmatterSchema } from '@conduit8/core';
import fm from 'front-matter';
import JSZip from 'jszip';

import type { SkillFrontmatter } from '../components/submit-skill-dialog/submit-skill-form.schema';

/**
 * File information from ZIP
 */
export interface FileInfo {
  name: string;
  size: number;
}

/**
 * Check if file path is system metadata that should be excluded
 * Covers macOS, Windows, Linux hidden/system files
 */
function isSystemMetadata(path: string): boolean {
  // 1. Exclude OS-specific directory prefixes
  if (path.includes('__MACOSX/'))
    return true;

  // 2. Exclude system files by name
  const fileName = path.split('/').pop() || '';

  const systemFiles = [
    '.DS_Store', // macOS
    'Thumbs.db', // Windows
    'desktop.ini', // Windows
    '.directory', // Linux KDE
  ];

  return systemFiles.includes(fileName);
}

/**
 * Parsed skill data from ZIP
 */
export interface ParsedSkillData {
  content: string;
  frontmatter: SkillFrontmatter;
  excerpt: string;
  files: FileInfo[];
  totalSize: number;
}

/**
 * Domain model representing a skill package (ZIP file)
 * Handles parsing and validation of skill ZIP files
 */
export class SkillPackage {
  private constructor(
    private readonly file: File,
    private readonly data: ParsedSkillData,
  ) { }

  /**
   * Find SKILL.md file in ZIP (case-insensitive)
   */
  private static findSkillMdFile(zip: JSZip): string {
    const allFiles = Object.keys(zip.files);
    const skillMdFiles = allFiles.filter((path) => {
      const fileName = path.split('/').pop() || '';
      return fileName.toUpperCase() === 'SKILL.MD';
    });

    this.validateSkillMdCount(skillMdFiles);
    return skillMdFiles[0]!;
  }

  /**
   * Validate exactly one SKILL.md file exists
   */
  private static validateSkillMdCount(skillMdFiles: string[]): void {
    if (skillMdFiles.length === 0) {
      throw new Error('ZIP must contain exactly one SKILL.md file.');
    }

    if (skillMdFiles.length > 1) {
      throw new Error(`ZIP must contain exactly one SKILL.md file. Found ${skillMdFiles.length}: ${skillMdFiles.join(', ')}`);
    }
  }

  /**
   * Create SkillPackage from uploaded file
   */
  static async fromFile(zipFile: File): Promise<SkillPackage> {
    try {
      const zip = await JSZip.loadAsync(zipFile);
      const skillMdPath = this.findSkillMdFile(zip);
      const skillMdFile = zip.file(skillMdPath);

      if (!skillMdFile) {
        throw new Error('Failed to read SKILL.md file from ZIP');
      }

      // Extract SKILL.md content
      const skillMdContent = await (skillMdFile as JSZip.JSZipObject).async('text');

      // Parse frontmatter
      const { attributes: rawFrontmatter, body } = fm(skillMdContent);

      // Validate frontmatter using core schema (business logic)
      const frontmatter = SkillFrontmatterSchema.parse(rawFrontmatter);

      // Extract first 200 chars of body for preview
      const excerpt = body.trim().slice(0, 200) + (body.length > 200 ? '...' : '');

      // Get file list (exclude directories and system metadata)
      const files = Object.keys(zip.files)
        .filter((path) => {
          const file = zip.files[path];
          if (!file || file.dir)
            return false;

          // Exclude system metadata files
          return !isSystemMetadata(path);
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

      const parsedData: ParsedSkillData = {
        content: skillMdContent,
        frontmatter: frontmatter as SkillFrontmatter,
        excerpt,
        files,
        totalSize: zipFile.size,
      };

      return new SkillPackage(zipFile, parsedData);
    }
    catch (error) {
      console.error('[SkillPackage] Error parsing ZIP:', error);

      // Re-throw with better context
      if (error instanceof Error) {
        throw error;
      }

      throw new Error('Failed to parse ZIP file');
    }
  }

  /**
   * Get the original file
   */
  getFile(): File {
    return this.file;
  }

  /**
   * Get frontmatter from SKILL.md
   */
  getFrontmatter(): SkillFrontmatter {
    return this.data.frontmatter;
  }

  /**
   * Get content excerpt
   */
  getExcerpt(): string {
    return this.data.excerpt;
  }

  /**
   * Get list of files in ZIP
   */
  getFiles(): FileInfo[] {
    return this.data.files;
  }

  /**
   * Get total ZIP file size
   */
  getTotalSize(): number {
    return this.data.totalSize;
  }

  /**
   * Get full SKILL.md content
   */
  getContent(): string {
    return this.data.content;
  }
}
