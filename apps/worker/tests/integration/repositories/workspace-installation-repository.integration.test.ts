import { env } from 'cloudflare:test';
import { describe, expect, it } from 'vitest';

import { WorkspaceInstallation } from '@worker/domain/models';
import { WorkspaceRepository } from '@worker/infrastructure/persistence/repositories';

/**
 * Integration tests for WorkspaceRepository
 * Tests the repository with actual KV and D1 storage
 */
describe('workspaceRepository Integration', () => {
  it('saves and retrieves workspace installation', async () => {
    // Skip if required bindings are not available
    if (!env.KV || !env.D1) {
      console.warn('KV or D1 not available, skipping test');
      return;
    }

    const repo = new WorkspaceRepository(env.KV, env.D1);

    const installation = new WorkspaceInstallation(
      'T123TEST',
      'Test Workspace',
      'xoxb-test-token',
      'U123BOT',
      'A123APP',
      ['chat:write', 'channels:read']
    );

    // Save installation
    const saved = await repo.save(installation);
    expect(saved.teamId).toBe('T123TEST');

    // Retrieve installation
    const retrieved = await repo.findByTeamId('T123TEST');
    expect(retrieved).toBeDefined();
    expect(retrieved?.teamName).toBe('Test Workspace');
    expect(retrieved?.slackAccessToken).toBe('xoxb-test-token');
  });

  it('returns null for non-existent workspace', async () => {
    if (!env.KV || !env.D1) {
      console.warn('KV or D1 not available, skipping test');
      return;
    }

    const repo = new WorkspaceRepository(env.KV, env.D1);

    // Use a unique ID that definitely doesn't exist
    const result = await repo.findByTeamId(`T_NONEXISTENT_${Date.now()}`);
    expect(result).toBeNull();
  });

  it('updates existing workspace installation', async () => {
    if (!env.KV || !env.D1) {
      console.warn('KV or D1 not available, skipping test');
      return;
    }

    const repo = new WorkspaceRepository(env.KV, env.D1);

    // Use unique ID to avoid conflicts
    const teamId = `T789UPDATE_${Date.now()}`;

    // Create initial installation
    const installation = new WorkspaceInstallation(
      teamId,
      'Original Name',
      'xoxb-old-token',
      'U789BOT',
      'A789APP',
      ['chat:write']
    );
    await repo.save(installation);

    // Update with new data
    const updated = new WorkspaceInstallation(
      teamId,
      'Updated Name',
      'xoxb-new-token',
      'U789BOT',
      'A789APP',
      ['chat:write', 'channels:read', 'users:read']
    );
    await repo.save(updated);

    // Verify update
    const retrieved = await repo.findByTeamId(teamId);
    expect(retrieved?.teamName).toBe('Updated Name');
    expect(retrieved?.slackAccessToken).toBe('xoxb-new-token');
    expect(retrieved?.scopes).toHaveLength(3);
  });

  it('saves and deletes workspace installation', async () => {
    if (!env.KV || !env.D1) {
      console.warn('KV or D1 not available, skipping test');
      return;
    }

    const repo = new WorkspaceRepository(env.KV, env.D1);

    // Use unique ID with timestamp to avoid conflicts
    const teamId = `T999DELETE_${Date.now()}`;

    const installation = new WorkspaceInstallation(
      teamId,
      'Delete Me',
      'xoxb-delete-token',
      'U999BOT',
      'A999APP',
      []
    );

    // Save and verify it can be retrieved
    await repo.save(installation);
    const saved = await repo.findByTeamId(teamId);
    expect(saved).toBeDefined();
    expect(saved?.teamName).toBe('Delete Me');

    // Delete and verify gone
    await repo.delete(teamId);
    const deleted = await repo.findByTeamId(teamId);
    expect(deleted).toBeNull();
  });
});
