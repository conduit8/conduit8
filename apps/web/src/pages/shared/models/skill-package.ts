import type { SkillFrontmatter } from '@conduit8/core';

import { MAX_SKILL_FILES, MAX_SKILL_PACKAGE_SIZE_BYTES, SkillFrontmatterSchema } from '@conduit8/core';
import fm from 'front-matter';
import JSZip from 'jszip';
import { ZodError } from 'zod';

import {
  FileTooLargeError,
  InvalidFrontmatterError,
  MissingSkillMdError,
  MultipleSkillMdError,
  NestedArchiveError,
  NestedSkillMdError,
  ParseError,
  TooManyFilesError,
} from './skill-package-errors';

/**
 * File information from ZIP
 */
export interface FileInfo {
  name: string;
  size: number;
}

/**
 * Archive file extensions (security - prevent nested archives)
 */
const ARCHIVE_EXTENSIONS = new Set([
  '.zip',
  '.tar',
  '.gz',
  '.rar',
  '.7z',
  '.bz2',
  '.xz',
  '.tgz',
]);

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
 * Check if file is a nested archive (security check)
 */
function isNestedArchive(path: string): boolean {
  const fileName = path.split('/').pop() || '';
  const fileExt = fileName.toLowerCase().slice(fileName.lastIndexOf('.'));
  return ARCHIVE_EXTENSIONS.has(fileExt);
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
 *
 * TODO: Move shared validation logic to @conduit8/core to avoid duplication with backend
 */
export class SkillPackage {
  private constructor(
    private readonly file: File,
    private readonly data: ParsedSkillData,
  ) { }

  /**
   * Find SKILL.md file in ZIP (case-insensitive)
   * Performs two checks:
   * 1. Exactly one SKILL.md exists
   * 2. SKILL.md is at root level (not nested in directories)
   */
  private static findSkillMdFile(zip: JSZip): string {
    const allFiles = Object.keys(zip.files);
    const skillMdFiles = allFiles.filter((path) => {
      const fileName = path.split('/').pop() || '';
      return fileName.toUpperCase() === 'SKILL.MD';
    });

    // Check 1: Exactly one SKILL.md exists
    this.validateSkillMdCount(skillMdFiles);

    // Check 2: SKILL.md is at root level
    this.validateSkillMdLocation(skillMdFiles[0]!);

    return skillMdFiles[0]!;
  }

  /**
   * Validate exactly one SKILL.md file exists
   */
  private static validateSkillMdCount(skillMdFiles: string[]): void {
    if (skillMdFiles.length === 0) {
      throw new MissingSkillMdError();
    }

    if (skillMdFiles.length > 1) {
      throw new MultipleSkillMdError(skillMdFiles.length, skillMdFiles);
    }
  }

  /**
   * Validate SKILL.md is at root level (not nested in subdirectories)
   */
  private static validateSkillMdLocation(skillMdPath: string): void {
    // SKILL.md must be at root - check case-insensitively
    if (skillMdPath.toUpperCase() !== 'SKILL.MD') {
      throw new NestedSkillMdError(skillMdPath);
    }
  }

  /**
   * Create SkillPackage from uploaded file
   */
  static async fromFile(zipFile: File): Promise<SkillPackage> {
    // Validate file size before parsing
    if (zipFile.size > MAX_SKILL_PACKAGE_SIZE_BYTES) {
      const sizeMB = Number((zipFile.size / 1024 / 1024).toFixed(1));
      const maxMB = Number((MAX_SKILL_PACKAGE_SIZE_BYTES / 1024 / 1024).toFixed(0));
      throw new FileTooLargeError(sizeMB, maxMB);
    }

    try {
      const zip = await JSZip.loadAsync(zipFile);
      const skillMdPath = this.findSkillMdFile(zip);
      const skillMdFile = zip.file(skillMdPath);

      if (!skillMdFile) {
        throw new ParseError('Failed to read SKILL.md file from ZIP');
      }

      // Extract SKILL.md content
      const skillMdContent = await (skillMdFile as JSZip.JSZipObject).async('text');

      // Parse frontmatter
      const { attributes: rawFrontmatter, body } = fm(skillMdContent);

      // Validate frontmatter using core schema (business logic)
      let frontmatter: SkillFrontmatter;
      try {
        frontmatter = SkillFrontmatterSchema.parse(rawFrontmatter) as SkillFrontmatter;
      }
      catch (error) {
        if (error instanceof ZodError) {
          const issues = error.issues.map(issue => `${issue.path.join('.')}: ${issue.message}`).join('; ');
          throw new InvalidFrontmatterError(issues);
        }
        throw new InvalidFrontmatterError('Unknown validation error');
      }

      // Extract first 200 chars of body for preview
      const excerpt = body.trim().slice(0, 200) + (body.length > 200 ? '...' : '');

      // Get file list (exclude directories and system metadata)
      const files: FileInfo[] = [];

      for (const path of Object.keys(zip.files)) {
        const file = zip.files[path];

        // Skip directories
        if (!file || file.dir)
          continue;

        // Skip system metadata files
        if (isSystemMetadata(path))
          continue;

        // Check for nested archives (security - block malware hiding technique)
        if (isNestedArchive(path)) {
          throw new NestedArchiveError(path);
        }

        files.push({
          name: path,
          size: 0, // Size not available from JSZip without reading each file
        });
      }

      // Sort files by name
      files.sort((a, b) => a.name.localeCompare(b.name));

      // Validate max files (prevent excessive file uploads)
      if (files.length > MAX_SKILL_FILES) {
        throw new TooManyFilesError(files.length, MAX_SKILL_FILES);
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

      // Re-throw typed errors as-is
      if (error instanceof FileTooLargeError
        || error instanceof MissingSkillMdError
        || error instanceof MultipleSkillMdError
        || error instanceof NestedSkillMdError
        || error instanceof InvalidFrontmatterError
        || error instanceof NestedArchiveError
        || error instanceof TooManyFilesError) {
        throw error;
      }

      // Wrap unknown errors
      if (error instanceof Error) {
        throw new ParseError(error.message);
      }

      throw new ParseError();
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
