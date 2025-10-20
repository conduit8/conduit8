import type { Skill } from '@conduit8/core';

import yaml from 'js-yaml';
import { existsSync, mkdirSync } from 'node:fs';
import { mkdir, readdir, readFile, rm, writeFile } from 'node:fs/promises';
import { join } from 'node:path';

import { DEFAULT_SKILLS_DIR } from './config';

/**
 * Download and install a skill
 * STUB: Creates a dummy SKILL.md file instead of downloading ZIP
 */
export async function installSkill(skill: Skill, skillsDir: string = DEFAULT_SKILLS_DIR): Promise<void> {
  const targetDir = join(skillsDir, skill.slug);

  // Ensure skills directory exists
  if (!existsSync(skillsDir)) {
    mkdirSync(skillsDir, { recursive: true });
  }

  // Create skill directory
  if (!existsSync(targetDir)) {
    await mkdir(targetDir, { recursive: true });
  }

  // Create SKILL.md with frontmatter
  const skillMd = createSkillMarkdown(skill);
  await writeFile(join(targetDir, 'SKILL.md'), skillMd, 'utf-8');

  // Create a dummy script file to make it feel real
  await mkdir(join(targetDir, 'scripts'), { recursive: true });
  await writeFile(
    join(targetDir, 'scripts', 'example.py'),
    `# Example script for ${skill.name}\nprint("Hello from ${skill.slug}")\n`,
    'utf-8'
  );
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
export async function listInstalledSkills(): Promise<Array<{ id: string; name: string; description: string }>> {
  // Ensure directory exists
  if (!existsSync(SKILLS_DIR)) {
    mkdirSync(SKILLS_DIR, { recursive: true });
    return [];
  }

  const entries = await readdir(SKILLS_DIR, { withFileTypes: true });
  const skills = [];

  for (const entry of entries) {
    if (!entry.isDirectory())
      continue;

    try {
      const skillPath = join(SKILLS_DIR, entry.name, 'SKILL.md');
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
export function isSkillInstalled(skillId: string): boolean {
  return existsSync(join(SKILLS_DIR, skillId, 'SKILL.md'));
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

/**
 * Create SKILL.md content with frontmatter
 */
function createSkillMarkdown(skill: Skill): string {
  const frontmatter = yaml.dump({
    name: skill.slug,
    description: skill.description,
    license: 'MIT'
  });

  return `---
${frontmatter}---

# ${skill.name}

## Overview

${skill.description}

## Examples

${skill.examples.map(ex => `- ${ex}`).join('\n')}

## Author

- **${skill.author}** (${skill.authorKind})
- Downloads: ${skill.downloadCount}
- Category: ${skill.category}

---

*This is a stub skill created by conduit8 CLI for testing purposes.*
`;
}
