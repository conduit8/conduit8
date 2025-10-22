import { Skill } from '@worker/domain/models';
import { SkillCategorizationService } from '@worker/domain/services';
import AdmZip from 'adm-zip';
import matter from 'gray-matter';
import { Buffer } from 'node:buffer';

import type { CommandHandler } from '@worker/application/handlers/types';
import type { IngestSkill } from '@worker/domain/messages/commands';

import { InvalidSkillMetadataError } from '@worker/infrastructure/errors/domain.errors';
import { SkillRepository } from '@worker/infrastructure/persistence/repositories/skill.repository';

/**
 * Command handler for ingesting skills from R2 inbox
 * Downloads ZIP, parses metadata, categorizes with AI, stores to R2/D1
 */
export const ingestSkill: CommandHandler<IngestSkill, void> = async (
  command: IngestSkill,
  env: Env,
) => {
  const fileKey = command.fileKey;
  console.log(`[IngestSkill] Starting: ${fileKey}`);

  try {
    // 1. Download ZIP from inbox
    const zipObject = await env.R2_PUBLIC.get(fileKey);
    if (!zipObject) {
      throw new InvalidSkillMetadataError(`ZIP not found: ${fileKey}`);
    }

    // 2. Parse ZIP (SKILL.md + metadata.json)
    let zip: AdmZip;
    let zipBuffer: ArrayBuffer;
    try {
      zipBuffer = await zipObject.arrayBuffer();
      zip = new AdmZip(Buffer.from(zipBuffer));
    }
    catch (error) {
      console.error('[IngestSkill] Failed to parse ZIP', { fileKey, error });
      throw new InvalidSkillMetadataError('Failed to parse ZIP file');
    }

    // Extract SKILL.md
    const skillMdEntry = zip.getEntry('SKILL.md');
    if (!skillMdEntry) {
      throw new InvalidSkillMetadataError('SKILL.md not found in ZIP');
    }

    const skillMdContent = skillMdEntry.getData().toString('utf-8');
    const { data: frontmatter } = matter(skillMdContent);

    // Extract metadata.json
    const metadataEntry = zip.getEntry('metadata.json');
    if (!metadataEntry) {
      throw new InvalidSkillMetadataError('metadata.json not found in ZIP');
    }

    const metadataContent = metadataEntry.getData().toString('utf-8');
    const metadata = JSON.parse(metadataContent);

    // 3. Categorize with AI
    const categorizationService = new SkillCategorizationService(env.AI);
    const category = await categorizationService.categorize(frontmatter.description);

    // 4. Create Skill domain model (validates everything)
    const skill = Skill.create({
      'slug': frontmatter.name,
      'displayName': frontmatter.name,
      'description': frontmatter.description,
      'license': frontmatter.license,
      'allowed-tools': frontmatter['allowed-tools'],
      ...metadata,
      'category': category,
    });

    // 5. Atomic insert: Upload ZIP + image to R2, then insert to D1
    const repo = new SkillRepository(env.D1, env.R2_PUBLIC);
    await repo.insert(skill, zipBuffer);
    console.log(`[IngestSkill] Uploaded and inserted: ${skill.slug}`);

    // 6. Cleanup inbox
    await env.R2_PUBLIC.delete(fileKey);
    console.log(`[IngestSkill] Success: ${skill.slug}`);

    return { result: undefined, events: [] };
  }
  catch (error) {
    console.error(`[IngestSkill] Failed: ${fileKey}`, error);

    // Move to failed/
    // Use a repository method for this?
    await moveToFailed(fileKey, error as Error, env);

    throw error;
  }
};

/**
 * Move failed skill to inbox/failed/ with error details
 */
async function moveToFailed(fileKey: string, error: Error, env: Env): Promise<void> {
  try {
    const failedKey = fileKey.replace('inbox/', 'inbox/failed/');

    // Copy ZIP to failed/
    const zipObject = await env.R2_PUBLIC.get(fileKey);
    if (zipObject) {
      await env.R2_PUBLIC.put(failedKey, zipObject.body);

      // Write error.txt
      const errorKey = failedKey.replace('.zip', '.error.txt');
      await env.R2_PUBLIC.put(errorKey, JSON.stringify({
        error: error.message,
        stack: error.stack,
        timestamp: new Date().toISOString(),
      }, null, 2));

      // Delete original
      await env.R2_PUBLIC.delete(fileKey);

      console.log(`[IngestSkill] Moved to failed: ${failedKey}`);
    }
  }
  catch (moveError) {
    console.error(`[IngestSkill] Failed to move to failed/`, moveError);
  }
}
