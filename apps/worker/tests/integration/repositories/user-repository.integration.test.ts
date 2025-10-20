import { ClaudeInstanceConfig } from '@worker/domain/models/user/claude-instance-config';
import { User } from '@worker/domain/models/user/user';
import { UserRepository } from '@worker/infrastructure/persistence/repositories/user-repository';
import { env } from 'cloudflare:test';
import { describe, expect, it } from 'vitest';

describe('userRepository Integration', () => {
  it('should save and retrieve a user', async () => {
    const repository = new UserRepository(env.KV, env.D1);

    const config = ClaudeInstanceConfig.create({
      githubToken: 'ghp_test123',
      anthropicKey: 'sk-ant-test123',
    });

    const user = new User(
      `user_${Date.now()}`,
      'slack',
      config,
      new Date(),
      new Date(),
    );

    // Save
    await repository.save(user);

    // Retrieve
    const retrieved = await repository.findByPlatformId(user.platformUserId);

    expect(retrieved).not.toBeNull();
    expect(retrieved?.platformUserId).toBe(user.platformUserId);
    expect(retrieved?.config.githubToken).toBe('ghp_test123');
    expect(retrieved?.config.anthropicKey).toBe('sk-ant-test123');
  });

  it('should delete a user', async () => {
    const repository = new UserRepository(env.KV, env.D1);

    const userId = `user_${Date.now()}`;
    const config = ClaudeInstanceConfig.create({
      githubToken: 'ghp_test',
      anthropicKey: 'sk-ant-test',
    });

    const user = new User(userId, 'slack', config, new Date(), new Date());

    // Save, verify exists, delete, verify gone
    await repository.save(user);
    expect(await repository.exists(userId)).toBe(true);

    await repository.deleteByPlatformId(userId);
    expect(await repository.exists(userId)).toBe(false);
  });

  it('should update existing user', async () => {
    const repository = new UserRepository(env.KV, env.D1);

    const userId = `user_${Date.now()}`;

    // Initial save
    const config1 = ClaudeInstanceConfig.create({
      githubToken: 'ghp_old',
      anthropicKey: 'sk-ant-old',
    });
    await repository.save(new User(userId, 'slack', config1, new Date(), new Date()));

    // Update
    const config2 = ClaudeInstanceConfig.create({
      githubToken: 'ghp_new',
      anthropicKey: 'sk-ant-new',
    });
    await repository.save(new User(userId, 'slack', config2, new Date(), new Date()));

    // Verify update
    const retrieved = await repository.findByPlatformId(userId);
    expect(retrieved?.config.githubToken).toBe('ghp_new');
    expect(retrieved?.config.anthropicKey).toBe('sk-ant-new');
  });
});
