#!/usr/bin/env node
/**
 * Import Anthropic skills from local /skills directory
 *
 * IMPORTANT: This script imports ANTHROPIC-AUTHORED skills only.
 * For other sources (Notion, etc), create separate import script.
 *
 * Usage:
 *   cd scripts && npx tsx import-local-skills.ts
 *
 * Environment: PREVIEW ONLY (NEVER prod)
 * - R2: REMOTE preview bucket (conduit8-public-preview)
 * - D1: LOCAL preview database
 *
 * What it does:
 * 1. Scans /skills directory for folders with SKILL.md
 * 2. Parses SKILL.md frontmatter for metadata
 * 3. Creates ZIP of each skill folder
 * 4. Uploads ZIP to REMOTE R2 preview: skills/{slug}.zip
 * 5. Creates placeholder image in REMOTE R2: images/{slug}.png
 * 6. Inserts metadata to LOCAL D1 database
 */

import archiver from 'archiver';
import { execSync } from 'node:child_process';
import { randomUUID } from 'node:crypto';
import { createWriteStream, mkdirSync, readdirSync, readFileSync, statSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { parse as parseYaml } from 'yaml';

// Resolve paths relative to project root (parent of scripts dir)
const PROJECT_ROOT = join(process.cwd(), '..');
const WORKER_DIR = join(PROJECT_ROOT, 'apps', 'worker');
const SKILLS_DIR = join(PROJECT_ROOT, 'skills');
const TEMP_DIR = join(PROJECT_ROOT, 'scripts', '.temp-zips');
const R2_BUCKET = 'conduit8-public-preview'; // Public bucket for skills
const ENV = 'preview'; // ALWAYS use preview, NEVER prod
const DRY_RUN = false; // Set to false to actually execute wrangler commands

interface SkillMetadata {
  id: string;
  name: string;
  description: string;
  license?: string;
}

interface SkillRecord {
  id: string; // UUID
  slug: string;
  name: string;
  description: string;
  category: string | null;
  zipKey: string;
  imageKey: string;
  examples: string[];
  curatorNote: string | null;
  author: string;
  authorKind: 'verified' | 'community';
  sourceType: 'import' | 'pr' | 'submission';
  sourceUrl: string | null;
  createdAt: number; // Unix timestamp seconds
  updatedAt: number; // Unix timestamp seconds
}

async function main() {
  console.log('🚀 Starting skill import from /skills directory');
  console.log(`Mode: ${DRY_RUN ? 'DRY RUN (no actual changes)' : 'LIVE (will execute commands)'}\n`);

  // Create temp directory for ZIPs
  mkdirSync(TEMP_DIR, { recursive: true });

  // Find all skill folders
  const skillFolders = findSkillFolders(SKILLS_DIR);
  console.log(`Found ${skillFolders.length} skills:\n${skillFolders.map(s => `  - ${s}`).join('\n')}\n`);

  const imported: string[] = [];
  const failed: Array<{ id: string; error: string }> = [];

  for (const skillId of skillFolders) {
    try {
      console.log(`\n📦 Processing: ${skillId}`);
      await importSkill(skillId);
      imported.push(skillId);
      console.log(`✅ Success: ${skillId}`);
    }
    catch (error) {
      const errorMsg = error instanceof Error ? error.message : String(error);
      failed.push({ id: skillId, error: errorMsg });
      console.error(`❌ Failed: ${skillId} - ${errorMsg}`);
    }
  }

  // Summary
  console.log(`\n${'='.repeat(50)}`);
  console.log('📊 Import Summary:');
  console.log(`  ✅ Imported: ${imported.length}`);
  console.log(`  ❌ Failed: ${failed.length}`);

  if (failed.length > 0) {
    console.log('\nFailed skills:');
    failed.forEach(({ id, error }) => {
      console.log(`  - ${id}: ${error}`);
    });
  }
}

function findSkillFolders(dir: string): string[] {
  const items = readdirSync(dir);
  const skills: string[] = [];

  for (const item of items) {
    const fullPath = join(dir, item);
    const stat = statSync(fullPath);

    // Skip files and hidden directories
    if (!stat.isDirectory() || item.startsWith('.')) {
      continue;
    }

    // Check if SKILL.md exists
    const skillMdPath = join(fullPath, 'SKILL.md');
    try {
      statSync(skillMdPath);
      skills.push(item);
    }
    catch {
      console.warn(`⚠️  Skipping ${item}: No SKILL.md found`);
    }
  }

  return skills;
}

async function importSkill(skillId: string): Promise<void> {
  const skillPath = join(SKILLS_DIR, skillId);

  // 1. Parse SKILL.md
  console.log('  📄 Parsing SKILL.md...');
  const metadata = parseSkillMetadata(skillPath);

  // 2. Create ZIP
  console.log('  🗜️  Creating ZIP...');
  const zipPath = await createSkillZip(skillId, skillPath);

  // 3. Upload ZIP to R2
  console.log('  ☁️  Uploading to R2...');
  const zipKey = `skills/${skillId}.zip`;
  uploadToR2(zipPath, zipKey);

  // 4. Create placeholder image
  console.log('  🖼️  Creating placeholder image...');
  const imageKey = `images/${skillId}.png`;
  createPlaceholderImage(skillId, imageKey);

  // 5. Insert to D1
  console.log('  💾 Inserting to D1...');
  const now = Math.floor(Date.now() / 1000); // Unix timestamp in seconds

  const record: SkillRecord = {
    id: randomUUID(),
    slug: skillId,
    name: metadata.name,
    description: metadata.description,
    category: null,
    zipKey,
    imageKey,
    examples: [], // Will curate examples manually later
    curatorNote: null,
    author: 'anthropic', // This script is ONLY for Anthropic skills
    authorKind: 'verified',
    sourceType: 'import',
    sourceUrl: `https://github.com/anthropics/skills/tree/main/${skillId}`,
    createdAt: now,
    updatedAt: now,
  };

  insertToD1(record);
}

function parseSkillMetadata(skillPath: string): SkillMetadata {
  const skillMdPath = join(skillPath, 'SKILL.md');
  const content = readFileSync(skillMdPath, 'utf-8');

  // Extract YAML frontmatter
  const match = content.match(/^---\n([\s\S]*?)\n---/);
  if (!match) {
    throw new Error('No YAML frontmatter found in SKILL.md');
  }

  const yaml = parseYaml(match[1]) as Record<string, unknown>;

  // Validate required fields - NO FALLBACKS
  if (!yaml.name || typeof yaml.name !== 'string') {
    throw new Error('Missing or invalid "name" in SKILL.md frontmatter');
  }

  if (!yaml.description || typeof yaml.description !== 'string') {
    throw new Error('Missing or invalid "description" in SKILL.md frontmatter');
  }

  return {
    id: yaml.name,
    name: yaml.name,
    description: yaml.description,
    license: yaml.license ? String(yaml.license) : undefined,
  };
}

async function createSkillZip(skillId: string, skillPath: string): Promise<string> {
  const zipPath = join(TEMP_DIR, `${skillId}.zip`);

  return new Promise((resolve, reject) => {
    const output = createWriteStream(zipPath);
    const archive = archiver('zip', { zlib: { level: 9 } });

    output.on('close', () => resolve(zipPath));
    archive.on('error', reject);

    archive.pipe(output);
    archive.directory(skillPath, false); // Don't include parent folder in ZIP
    archive.finalize();
  });
}

function uploadToR2(zipPath: string, key: string): void {
  // Use REMOTE preview R2 (bucket name defines env, no --env flag needed)
  const cmd = `npx wrangler r2 object put ${R2_BUCKET}/${key} --file "${zipPath}" --remote`;

  if (DRY_RUN) {
    console.log(`    [DRY RUN] Would upload: ${zipPath} → ${key} (REMOTE ${R2_BUCKET})`);
  }
  else {
    execSync(cmd, { stdio: 'inherit', cwd: WORKER_DIR });
  }
}

function createPlaceholderImage(skillId: string, key: string): void {
  const placeholderPath = join(TEMP_DIR, `${skillId}-placeholder.png`);

  if (DRY_RUN) {
    console.log(`    [DRY RUN] Would create placeholder: ${key} (REMOTE ${ENV})`);
  }
  else {
    writeFileSync(placeholderPath, `Placeholder for ${skillId}`);
    const cmd = `npx wrangler r2 object put ${R2_BUCKET}/${key} --file "${placeholderPath}" --remote --env ${ENV}`;
    execSync(cmd, { stdio: 'inherit', cwd: WORKER_DIR });
  }
}

function insertToD1(record: SkillRecord): void {
  if (DRY_RUN) {
    console.log(`    [DRY RUN] Would insert skill to D1:`);
    console.log(`      ID: ${record.id}`);
    console.log(`      Name: ${record.name}`);
    console.log(`      Description: ${record.description.substring(0, 80)}...`);
    console.log(`      Author: ${record.author} (${record.authorKind})`);
    console.log(`      Source: ${record.sourceUrl}`);
    return;
  }

  // Create SQL for insertion
  const sql = `
    INSERT INTO skills (
      id, slug, name, description, category, zip_key, image_key,
      examples, curator_note, author, author_kind,
      source_type, source_url, created_at, updated_at
    ) VALUES (
      '${record.id}',
      '${record.slug}',
      '${escapeSql(record.name)}',
      '${escapeSql(record.description)}',
      ${record.category ? `'${record.category}'` : 'NULL'},
      '${record.zipKey}',
      '${record.imageKey}',
      '${JSON.stringify(record.examples)}',
      ${record.curatorNote ? `'${escapeSql(record.curatorNote)}'` : 'NULL'},
      '${record.author}',
      '${record.authorKind}',
      '${record.sourceType}',
      ${record.sourceUrl ? `'${escapeSql(record.sourceUrl)}'` : 'NULL'},
      ${record.createdAt},
      ${record.updatedAt}
    );

    INSERT INTO skill_stats (skill_id, download_count)
    VALUES ('${record.id}', 0);
  `;

  // Write to temp SQL file
  const sqlPath = join(TEMP_DIR, `${record.id}.sql`);
  writeFileSync(sqlPath, sql);

  // Execute via wrangler (LOCAL D1, but preview env for config)
  const cmd = `npx wrangler d1 execute D1 --local --file "${sqlPath}" --env ${ENV}`;
  execSync(cmd, { stdio: 'inherit', cwd: WORKER_DIR });
}

function escapeSql(str: string): string {
  return str.replace(/'/g, '\'\'');
}

main().catch((error) => {
  console.error('\n❌ Fatal error:', error);
  process.exit(1);
});
