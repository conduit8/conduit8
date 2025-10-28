import { SkillPackage } from '@web/pages/public/home/models/skill-package';
import JSZip from 'jszip';
import { describe, expect, it } from 'vitest';

const SKILL_MD_VALID = `---
name: Test Skill
description: A test skill for validation
license: MIT
---

# Test Skill

This is a test skill used for validation testing.
`;

const SKILL_MD_INVALID_FRONTMATTER = `---
description: Missing name field
---

# Invalid Skill
`;

/**
 * Helper to create ZIP file from files object
 */
async function createZipFile(files: Record<string, string>): Promise<File> {
  const zip = new JSZip();

  for (const [path, content] of Object.entries(files)) {
    zip.file(path, content);
  }

  const blob = await zip.generateAsync({ type: 'blob' });
  return new File([blob], 'test.zip', { type: 'application/zip' });
}

describe('skillPackage', () => {
  describe('attack vector verification', () => {
    it('nested archive creates actual .zip file', async () => {
      const innerZip = new JSZip();
      innerZip.file('data.txt', 'Hidden data');
      const innerBlob = await innerZip.generateAsync({ type: 'blob' });

      expect(innerBlob.size).toBeGreaterThan(0);
      expect(innerBlob.type).toBe('application/zip');

      console.log('[NESTED ZIP] Inner ZIP size:', innerBlob.size, 'bytes');
    });

    it('path traversal creates actual ../ in ZIP', async () => {
      const zip = new JSZip();
      zip.file('SKILL.md', SKILL_MD_VALID);
      zip.file('../../../etc/passwd', 'malicious');

      const fileNames = Object.keys(zip.files);
      expect(fileNames).toContain('../../../etc/passwd');

      console.log('[PATH TRAVERSAL] Paths in ZIP:', fileNames);
    });
  });

  describe('valid submissions', () => {
    it('accepts minimal valid ZIP (SKILL.md only)', async () => {
      const file = await createZipFile({
        'SKILL.md': SKILL_MD_VALID,
      });

      const pkg = await SkillPackage.fromFile(file);

      expect(pkg.getFrontmatter().name).toBe('Test Skill');
      expect(pkg.getFrontmatter().description).toBe('A test skill for validation');
      expect(pkg.getFrontmatter().license).toBe('MIT');
      expect(pkg.getFiles().length).toBeGreaterThan(0);
    });

    it('accepts ZIP with assets', async () => {
      const file = await createZipFile({
        'SKILL.md': SKILL_MD_VALID,
        'README.md': '# Additional documentation',
        'examples/example1.txt': 'Example file 1',
        'examples/example2.txt': 'Example file 2',
        'images/icon.svg': '<svg></svg>',
      });

      const pkg = await SkillPackage.fromFile(file);

      expect(pkg.getFrontmatter().name).toBe('Test Skill');
      expect(pkg.getFiles().length).toBeGreaterThan(1);
      expect(pkg.getFiles().some(f => f.name.includes('examples/'))).toBe(true);
    });
  });

  describe('file size validation', () => {
    it('rejects oversized ZIP', async () => {
      // Create 51MB file (max is 50MB)
      const largeContent = 'x'.repeat(51 * 1024 * 1024);
      const file = await createZipFile({
        'SKILL.md': SKILL_MD_VALID,
        'large.txt': largeContent,
      });

      await expect(SkillPackage.fromFile(file))
        .rejects
        .toThrow(/ZIP file too large.*Maximum 50MB allowed/);
    });
  });

  describe('nested archive blocking', () => {
    it('rejects ZIP containing nested archive', async () => {
      // Create inner ZIP
      const innerZip = new JSZip();
      innerZip.file('data.txt', 'Hidden data');
      const innerBuffer = await innerZip.generateAsync({ type: 'uint8array' });

      // Create outer ZIP
      const zip = new JSZip();
      zip.file('SKILL.md', SKILL_MD_VALID);
      zip.file('data/malware.zip', innerBuffer);

      const blob = await zip.generateAsync({ type: 'blob' });
      const file = new File([blob], 'test.zip', { type: 'application/zip' });

      await expect(SkillPackage.fromFile(file))
        .rejects
        .toThrow(/Nested archive files are not allowed/);
    });
  });

  describe('file count validation', () => {
    it('rejects ZIP with too many files', async () => {
      const files: Record<string, string> = {
        'SKILL.md': SKILL_MD_VALID,
      };

      // Add 101 files (max is 100)
      for (let i = 1; i <= 101; i++) {
        files[`file${i}.txt`] = `File ${i}`;
      }

      const file = await createZipFile(files);

      await expect(SkillPackage.fromFile(file))
        .rejects
        .toThrow(/too many files.*Maximum 100 files allowed/);
    });
  });

  describe('sKILL.md validation', () => {
    it('rejects ZIP without SKILL.md', async () => {
      const file = await createZipFile({
        'README.md': '# Missing SKILL.md',
      });

      await expect(SkillPackage.fromFile(file))
        .rejects
        .toThrow('ZIP must contain exactly one SKILL.md file');
    });

    it('rejects ZIP with multiple SKILL.md files', async () => {
      const file = await createZipFile({
        'SKILL.md': SKILL_MD_VALID,
        'backup/SKILL.md': SKILL_MD_VALID,
      });

      await expect(SkillPackage.fromFile(file))
        .rejects
        .toThrow(/ZIP must contain exactly one SKILL.md file.*Found 2/);
    });

    it('rejects ZIP with nested SKILL.md (not at root)', async () => {
      const file = await createZipFile({
        'notion-meeting-intelligence/SKILL.md': SKILL_MD_VALID,
        'notion-meeting-intelligence/README.md': '# Readme',
      });

      await expect(SkillPackage.fromFile(file))
        .rejects
        .toThrow(/SKILL\.md must be at the root level.*found at: notion-meeting-intelligence\/SKILL\.md/);
    });
  });

  describe('frontmatter validation', () => {
    it('rejects invalid frontmatter', async () => {
      const file = await createZipFile({
        'SKILL.md': SKILL_MD_INVALID_FRONTMATTER,
      });

      await expect(SkillPackage.fromFile(file))
        .rejects
        .toThrow();
    });
  });

  describe('system files handling', () => {
    it('excludes system files from file list', async () => {
      const file = await createZipFile({
        'SKILL.md': SKILL_MD_VALID,
        '__MACOSX/._SKILL.md': 'Mac metadata',
        '.DS_Store': 'Mac folder settings',
        'examples/example.txt': 'Example file',
      });

      const pkg = await SkillPackage.fromFile(file);

      // Should not include .DS_Store, Thumbs.db, __MACOSX
      expect(pkg.getFiles().every(f => !f.name.includes('.DS_Store'))).toBe(true);
      expect(pkg.getFiles().every(f => !f.name.includes('Thumbs.db'))).toBe(true);
      expect(pkg.getFiles().every(f => !f.name.includes('__MACOSX'))).toBe(true);

      // Should include valid files
      expect(pkg.getFiles().some(f => f.name.includes('examples/'))).toBe(true);
    });
  });
});
