import { env } from 'cloudflare:test';
import { describe, expect, it } from 'vitest';

import { Skill } from '@worker/domain/models/skill.model';
import { SkillRepository } from '@worker/infrastructure/persistence/repositories/skill.repository';

describe('skillRepository Integration', () => {
  // Mock ZIP buffer for tests
  const mockZipBuffer = new TextEncoder().encode('mock zip content').buffer;

  it('should insert and retrieve by ID', async () => {
    const repo = new SkillRepository(env.D1, env.R2_PUBLIC);
    const skill = Skill.create({
      slug: `test-skill-${Date.now()}`,
      displayName: 'Test Skill',
      description: 'A test skill for integration tests',
      category: 'development',
      examples: ['Example 1', 'Example 2'],
      curatorNote: null,
      author: 'Test Author',
      authorKind: 'community',
      sourceType: 'import',
      sourceUrl: 'https://example.com',
      allowedTools: ['*'],
      license: 'MIT',
    });

    await repo.insert(skill, mockZipBuffer);

    const retrieved = await repo.findById(skill.id);

    expect(retrieved).not.toBeNull();
    expect(retrieved?.id).toBe(skill.id);
    expect(retrieved?.slug).toBe(skill.slug);
    expect(retrieved?.name).toBe(skill.displayName);
  });

  it('should retrieve by slug', async () => {
    const repo = new SkillRepository(env.D1, env.R2_PUBLIC);
    const slug = `test-skill-${Date.now()}`;
    const skill = Skill.create({
      slug,
      displayName: 'Test Skill',
      description: 'A test skill for slug lookup',
      category: 'development',
      examples: ['Example'],
      curatorNote: null,
      author: 'Test Author',
      authorKind: 'verified',
      sourceType: 'pr',
      sourceUrl: 'https://example.com',
      allowedTools: ['*'],
      license: 'MIT',
    });

    await repo.insert(skill, mockZipBuffer);

    const retrieved = await repo.findBySlug(slug);

    expect(retrieved).not.toBeNull();
    expect(retrieved?.slug).toBe(slug);
  });

  it('should find all skills with download counts', async () => {
    const repo = new SkillRepository(env.D1, env.R2_PUBLIC);
    const slug = `test-findall-${Date.now()}`;
    const skill = Skill.create({
      slug,
      displayName: 'FindAll Test',
      description: 'Test skill for findAll',
      category: 'data',
      examples: ['Example'],
      curatorNote: 'Test note',
      author: 'Test Author',
      authorKind: 'community',
      sourceType: 'submission',
      sourceUrl: 'https://example.com',
      allowedTools: ['*'],
      license: 'MIT',
    });

    await repo.insert(skill, mockZipBuffer);

    const results = await repo.findAll();

    expect(results.length).toBeGreaterThan(0);
    expect(results.every(s => typeof s.downloadCount === 'number')).toBe(true);
  });

  it('should search skills by name', async () => {
    const repo = new SkillRepository(env.D1, env.R2_PUBLIC);
    const uniqueName = `SearchTest${Date.now()}`;
    const skill = Skill.create({
      slug: uniqueName.toLowerCase(),
      displayName: uniqueName,
      description: 'Skill for search testing',
      category: 'content',
      examples: ['Example'],
      curatorNote: null,
      author: 'Test Author',
      authorKind: 'community',
      sourceType: 'import',
      sourceUrl: 'https://example.com',
      allowedTools: ['*'],
      license: 'MIT',
    });

    await repo.insert(skill, mockZipBuffer);

    const results = await repo.findAll(uniqueName);

    expect(results.length).toBeGreaterThan(0);
    expect(results.some(s => s.name === uniqueName)).toBe(true);
  });

  it('should increment download count', async () => {
    const repo = new SkillRepository(env.D1, env.R2_PUBLIC);
    const skill = Skill.create({
      slug: `test-download-${Date.now()}`,
      displayName: 'Download Test',
      description: 'Test download counting',
      category: 'design',
      examples: ['Example'],
      curatorNote: null,
      author: 'Test Author',
      authorKind: 'verified',
      sourceType: 'pr',
      sourceUrl: 'https://example.com',
      allowedTools: ['*'],
      license: 'MIT',
    });

    await repo.insert(skill, mockZipBuffer);

    const countBefore = await repo.getDownloadCount(skill.id);
    await repo.incrementDownloadCount(skill.id);
    const countAfter = await repo.getDownloadCount(skill.id);

    expect(countAfter).toBe(countBefore + 1);
  });

  it('should return null for non-existent skill', async () => {
    const repo = new SkillRepository(env.D1, env.R2_PUBLIC);

    const byId = await repo.findById('non-existent-id');
    const bySlug = await repo.findBySlug('non-existent-slug');

    expect(byId).toBeNull();
    expect(bySlug).toBeNull();
  });

  it('should return 0 for non-existent skill download count', async () => {
    const repo = new SkillRepository(env.D1, env.R2_PUBLIC);

    const count = await repo.getDownloadCount('non-existent-id');

    expect(count).toBe(0);
  });
});
