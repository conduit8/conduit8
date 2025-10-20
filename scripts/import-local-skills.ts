#!/usr/bin/env node
/**
 * Import Anthropic skills from local /skills directory
 *
 * IMPORTANT: This script imports ANTHROPIC-AUTHORED skills only.
 * For other sources (Notion, etc), create separate import script.
 *
 * Usage:
 *   npx tsx import-local-skills.ts [env] [flags]
 *
 * Environments:
 *   local    - Local D1 + Remote R2 preview (for development)
 *   preview  - Remote D1 preview + Remote R2 preview
 *   prod     - Remote D1 prod + Remote R2 prod
 *
 * Flags:
 *   --dry-run      - Preview SQL without executing
 *   --skip-r2      - Skip R2 uploads (use when R2 already populated)
 *   --skip-images  - Skip placeholder image generation
 *
 * Examples:
 *   npx tsx import-local-skills.ts local          # Dev: local D1, remote preview R2
 *   npx tsx import-local-skills.ts preview        # Seed preview D1 (R2 exists)
 *   npx tsx import-local-skills.ts preview --skip-r2  # Just D1 seeding
 *   npx tsx import-local-skills.ts prod           # Seed production
 *   npx tsx import-local-skills.ts preview --dry-run  # Preview changes
 *
 * What it does:
 * 1. Scans /skills directory for folders with SKILL.md
 * 2. Parses SKILL.md frontmatter for metadata
 * 3. Loads skill metadata (categories, examples) from skill-metadata.json
 * 4. Creates ZIP of each skill folder
 * 5. Uploads ZIP to R2: skills/{slug}.zip (unless --skip-r2)
 * 6. Creates placeholder PNG in R2: images/{slug}.png (unless --skip-images)
 * 7. Inserts metadata to D1 database (idempotent with INSERT OR IGNORE)
 */

import archiver from 'archiver';
import { Buffer } from 'node:buffer';
import { execSync } from 'node:child_process';
import { createWriteStream, existsSync, mkdirSync, readdirSync, readFileSync, statSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { v5 as uuidv5 } from 'uuid';
import { parse as parseYaml } from 'yaml';

// Parse command line arguments
const args = process.argv.slice(2);
const ENV = args.find(arg => !arg.startsWith('--')) || 'local';
const DRY_RUN = args.includes('--dry-run');
const SKIP_R2 = args.includes('--skip-r2');
const SKIP_IMAGES = args.includes('--skip-images');

// Validate environment
if (!['local', 'preview', 'prod'].includes(ENV)) {
  console.error(`❌ Invalid environment: ${ENV}`);
  console.error('Valid environments: local, preview, prod');
  process.exit(1);
}

// Resolve paths relative to scripts dir
const WORKER_DIR = join(process.cwd(), '..', 'apps', 'worker');
const SKILLS_DIR = join(process.cwd(), 'local-skills', 'anthropic-skills');
const TEMP_DIR = join(process.cwd(), '.temp-zips');
const METADATA_FILE = join(process.cwd(), 'skill-metadata.json');

// Environment configuration
const R2_BUCKET = ENV === 'prod' ? 'conduit8-public' : 'conduit8-public-preview';
const USE_LOCAL_D1 = ENV === 'local';
const WRANGLER_ENV = ENV === 'prod' ? 'prod' : 'preview';

// Excluded skills (proprietary/source-available, not Apache 2.0)
const EXCLUDED_SKILLS = new Set(['pdf', 'docx', 'pptx', 'xlsx', 'template-skill']);

// Namespace UUID for conduit8 skills (UUIDv5 generation)
const SKILLS_NAMESPACE = '6ba7b810-9dad-11d1-80b4-00c04fd430c8';

/**
 * Generate stable UUID from skill slug using UUIDv5
 * Same slug always produces same UUID (idempotent imports)
 */
function generateSkillUUID(slug: string): string {
  return uuidv5(slug, SKILLS_NAMESPACE);
}

interface SkillMetadata {
  id: string;
  name: string;
  description: string;
  license?: string;
}

interface SkillEnhancedMetadata {
  category: string | null;
  examples: string[];
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
  console.log('🚀 Starting skill import from local-skills/anthropic-skills directory');
  console.log(`Environment: ${ENV}`);
  console.log(`D1: ${USE_LOCAL_D1 ? 'LOCAL' : 'REMOTE'} (${WRANGLER_ENV})`);
  console.log(`R2: ${R2_BUCKET}`);
  console.log(`Mode: ${DRY_RUN ? 'DRY RUN (no actual changes)' : 'LIVE (will execute commands)'}`);
  console.log(`Flags: ${SKIP_R2 ? '--skip-r2 ' : ''}${SKIP_IMAGES ? '--skip-images' : ''}`);
  console.log();

  // Load enhanced metadata
  console.log('📋 Loading skill metadata...');
  const enhancedMetadata = loadEnhancedMetadata();
  console.log(`Loaded metadata for ${Object.keys(enhancedMetadata).length} skills\n`);

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
      await importSkill(skillId, enhancedMetadata);
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

    // Skip excluded skills (proprietary/source-available)
    if (EXCLUDED_SKILLS.has(item)) {
      console.warn(`⚠️  Skipping ${item}: Proprietary/source-available (not Apache 2.0)`);
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

function loadEnhancedMetadata(): Record<string, SkillEnhancedMetadata> {
  if (!existsSync(METADATA_FILE)) {
    console.warn(`⚠️  Metadata file not found: ${METADATA_FILE}`);
    return {};
  }

  try {
    const content = readFileSync(METADATA_FILE, 'utf-8');
    return JSON.parse(content) as Record<string, SkillEnhancedMetadata>;
  }
  catch (error) {
    console.error(`❌ Failed to load metadata: ${error}`);
    return {};
  }
}

async function importSkill(
  skillId: string,
  enhancedMetadata: Record<string, SkillEnhancedMetadata>,
): Promise<void> {
  const skillPath = join(SKILLS_DIR, skillId);

  // 1. Parse SKILL.md
  console.log('  📄 Parsing SKILL.md...');
  const metadata = parseSkillMetadata(skillPath);

  // Get enhanced metadata (category, examples)
  const enhanced = enhancedMetadata[skillId];
  if (!enhanced) {
    console.warn(`  ⚠️  No enhanced metadata found for ${skillId}, using defaults`);
  }

  // 2. Create ZIP
  console.log('  🗜️  Creating ZIP...');
  const zipPath = await createSkillZip(skillId, skillPath);

  // 3. Upload ZIP to R2 (unless --skip-r2)
  const zipKey = `skills/${skillId}.zip`;
  if (SKIP_R2) {
    console.log('  ⏭️  Skipping R2 upload (--skip-r2)');
  }
  else {
    console.log('  ☁️  Uploading to R2...');
    uploadToR2(zipPath, zipKey);
  }

  // 4. Create placeholder image (unless --skip-images)
  const imageKey = `images/${skillId}.png`;
  if (SKIP_IMAGES) {
    console.log('  ⏭️  Skipping image generation (--skip-images)');
  }
  else {
    console.log('  🖼️  Creating placeholder image...');
    createPlaceholderImage(skillId, imageKey);
  }

  // 5. Insert to D1
  console.log('  💾 Inserting to D1...');
  const now = Math.floor(Date.now() / 1000); // Unix timestamp in seconds

  const record: SkillRecord = {
    id: generateSkillUUID(skillId), // Stable UUID from slug (idempotent)
    slug: skillId,
    name: skillId.replace(/-/g, ' '), // "algorithmic-art" -> "algorithmic art"
    description: metadata.description,
    category: enhanced?.category ?? null,
    zipKey,
    imageKey,
    examples: enhanced?.examples ?? [],
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
  if (!match?.[1]) {
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
    console.log(`    [DRY RUN] Would create placeholder: ${key} (${R2_BUCKET})`);
    return;
  }

  // Create a minimal 1x1 PNG (base64 decoded)
  // This is a tiny valid PNG file - replace with real images later
  const minimalPng = Buffer.from(
    'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
    'base64',
  );

  writeFileSync(placeholderPath, minimalPng);

  // Upload to R2
  const cmd = `npx wrangler r2 object put ${R2_BUCKET}/${key} --file "${placeholderPath}" --remote`;
  execSync(cmd, { stdio: 'inherit', cwd: WORKER_DIR });
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

  // Write two separate SQL files and execute sequentially
  const localFlag = USE_LOCAL_D1 ? '--local' : '--remote';

  // 1. Insert skill
  const skillSql = `INSERT OR IGNORE INTO skills (id, slug, name, description, category, zip_key, image_key, examples, curator_note, author, author_kind, source_type, source_url, created_at, updated_at) VALUES ('${record.id}', '${record.slug}', '${escapeSql(record.name)}', '${escapeSql(record.description)}', ${record.category ? `'${record.category}'` : 'NULL'}, '${record.zipKey}', '${record.imageKey}', '${JSON.stringify(record.examples)}', ${record.curatorNote ? `'${escapeSql(record.curatorNote)}'` : 'NULL'}, '${record.author}', '${record.authorKind}', '${record.sourceType}', ${record.sourceUrl ? `'${escapeSql(record.sourceUrl)}'` : 'NULL'}, ${record.createdAt}, ${record.updatedAt});`;

  const skillPath = join(TEMP_DIR, `${record.id}-skill.sql`);
  writeFileSync(skillPath, skillSql);
  execSync(`npx wrangler d1 execute D1 ${localFlag} --file "${skillPath}" --env ${WRANGLER_ENV}`, { stdio: 'inherit', cwd: WORKER_DIR });

  // 2. Insert skill_stats
  const statsSql = `INSERT OR IGNORE INTO skill_stats (skill_id, download_count) VALUES ('${record.id}', 0);`;
  const statsPath = join(TEMP_DIR, `${record.id}-stats.sql`);
  writeFileSync(statsPath, statsSql);
  execSync(`npx wrangler d1 execute D1 ${localFlag} --file "${statsPath}" --env ${WRANGLER_ENV}`, { stdio: 'inherit', cwd: WORKER_DIR });
}

function escapeSql(str: string): string {
  // Escape single quotes (SQL standard)
  // Escape double quotes as two single quotes
  return str.replace(/'/g, '\'\'').replace(/"/g, '\'\'');
}

main().catch((error) => {
  console.error('\n❌ Fatal error:', error);
  process.exit(1);
});

/*
 * SCRIPT FEATURES & SAFEGUARDS:
 *
 * ✅ Multi-environment support (local/preview/prod)
 * ✅ Idempotent operations (INSERT OR IGNORE - safe to re-run)
 * ✅ Skip flags (--skip-r2, --skip-images for partial updates)
 * ✅ Dry-run mode (--dry-run to preview changes)
 * ✅ License compliance (excludes proprietary skills: pdf, docx, pptx, xlsx)
 * ✅ Data completeness (categories + examples from skill-metadata.json)
 * ✅ Proper PNG placeholders (base64-encoded 1x1 PNG, replace with real images later)
 * ✅ Environment-aware wrangler commands (--local vs --remote)
 * ✅ Validation (warns if metadata missing, skips invalid skills)
 * ✅ Error handling (continues on failure, reports summary)
 *
 * USAGE EXAMPLES:
 *   npx tsx import-local-skills.ts local                    # Dev: local D1 + preview R2
 *   npx tsx import-local-skills.ts preview --skip-r2        # Seed preview D1 only
 *   npx tsx import-local-skills.ts prod                     # Seed production
 *   npx tsx import-local-skills.ts preview --dry-run        # Preview what would happen
 *
 * MANUAL SYNC WORKFLOW:
 *   1. Update /skills directory with latest from anthropics/skills repo
 *   2. Update scripts/skill-metadata.json with categories/examples
 *   3. Test locally: npx tsx import-local-skills.ts local
 *   4. Seed preview: npx tsx import-local-skills.ts preview
 *   5. Verify in dashboard, test with CLI
 *   6. Seed production: npx tsx import-local-skills.ts prod
 */
