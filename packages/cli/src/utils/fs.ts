import type { Skill } from '@conduit8/core';

import AdmZip from 'adm-zip';
import yaml from 'js-yaml';
import { Buffer } from 'node:buffer';
import { existsSync, mkdirSync } from 'node:fs';
import { readdir, readFile, rm } from 'node:fs/promises';
import { join } from 'node:path';

import { DEFAULT_SKILLS_DIR } from './config';

/**
 * Download ZIP file from URL with retry logic
 * @param url - URL to download from
 * @param retries - Number of retry attempts (default: 3)
 * @returns Buffer containing ZIP data
 */
export async function downloadZip(url: string, retries = 3): Promise<Buffer> {
  let lastError: Error | null = null;

  for (let attempt = 0; attempt < retries; attempt++) {
    try {
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const arrayBuffer = await response.arrayBuffer();
      return Buffer.from(arrayBuffer);
    }
    catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));

      // Don't retry on 4xx errors (client errors)
      if (lastError.message.includes('HTTP 4')) {
        throw lastError;
      }

      // Exponential backoff: 1s, 2s, 4s
      if (attempt < retries - 1) {
        await new Promise(resolve => setTimeout(resolve, 1000 * 2 ** attempt));
      }
    }
  }

  throw new Error(`Failed to download after ${retries} attempts: ${lastError?.message}`);
}

/**
 * Extract ZIP buffer to target directory
 * @param zipBuffer - Buffer containing ZIP data
 * @param targetDir - Directory to extract to
 */
export function extractZip(zipBuffer: Buffer, targetDir: string): void {
  const zip = new AdmZip(zipBuffer);
  zip.extractAllTo(targetDir, true); // true = overwrite existing files
}

/**
 * Validate skill directory has required SKILL.md file
 * @param skillDir - Directory to validate
 * @throws Error if SKILL.md is missing
 */
export function validateSkill(skillDir: string): void {
  const skillMdPath = join(skillDir, 'SKILL.md');

  if (!existsSync(skillMdPath)) {
    throw new Error('Invalid skill package - missing SKILL.md');
  }
}

/**
 * Download and install a skill
 */
export async function installSkill(skill: Skill, skillsDir: string = DEFAULT_SKILLS_DIR): Promise<void> {
  const targetDir = join(skillsDir, skill.slug);

  // Ensure skills directory exists
  if (!existsSync(skillsDir)) {
    mkdirSync(skillsDir, { recursive: true });
  }

  try {
    // Download ZIP from R2
    const zipBuffer = await downloadZip(skill.zipUrl);

    // Extract to target directory
    extractZip(zipBuffer, targetDir);

    // Validate installation
    validateSkill(targetDir);
  }
  catch (error) {
    // Cleanup on failure
    if (existsSync(targetDir)) {
      await rm(targetDir, { recursive: true, force: true });
    }
    throw error;
  }
}

/**
 * Remove an installed skill
 */
export async function removeSkill(skillId: string, skillsDir: string = DEFAULT_SKILLS_DIR): Promise<void> {
  const skillPath = join(skillsDir, skillId);

  if (!existsSync(skillPath)) {
    throw new Error(`Skill '${skillId}' is not installed`);
  }

  await rm(skillPath, { recursive: true, force: true });
}

/**
 * List all installed skills
 */
export async function listInstalledSkills(skillsDir: string = DEFAULT_SKILLS_DIR): Promise<Array<{ id: string; name: string; description: string }>> {
  // Ensure directory exists
  if (!existsSync(skillsDir)) {
    mkdirSync(skillsDir, { recursive: true });
    return [];
  }

  const entries = await readdir(skillsDir, { withFileTypes: true });
  const skills = [];

  for (const entry of entries) {
    if (!entry.isDirectory())
      continue;

    try {
      const skillPath = join(skillsDir, entry.name, 'SKILL.md');
      if (!existsSync(skillPath))
        continue;

      const content = await readFile(skillPath, 'utf-8');
      const frontmatter = extractFrontmatter(content);

      skills.push({
        id: entry.name,
        name: frontmatter.name || entry.name,
        description: frontmatter.description || ''
      });
    }
    catch (err) {
      // Skip corrupted skills
      console.warn(`Warning: Could not read ${entry.name}`);
    }
  }

  return skills;
}

/**
 * Check if skill is installed
 */
export function isSkillInstalled(skillId: string, skillsDir: string = DEFAULT_SKILLS_DIR): boolean {
  return existsSync(join(skillsDir, skillId, 'SKILL.md'));
}

/**
 * Extract YAML frontmatter from markdown
 */
function extractFrontmatter(content: string): Record<string, any> {
  const match = content.match(/^---\n([\s\S]*?)\n---/);
  if (!match || !match[1])
    return {};

  try {
    const parsed = yaml.load(match[1]);
    return (parsed && typeof parsed === 'object' && !Array.isArray(parsed))
      ? parsed as Record<string, any>
      : {};
  }
  catch {
    return {};
  }
}
