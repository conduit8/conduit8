import type { ClaudeInstanceConfig } from '@worker/domain/models';
import type { IUserRepository } from '@worker/domain/repositories';

import { User } from '@worker/domain/models';
import { UserRepository } from '@worker/infrastructure/persistence/repositories';

import { UserServiceError } from '@worker/infrastructure/errors/domain.errors';

/**
 * Domain service for user management
 *
 * Responsibilities:
 * - User configuration CRUD
 * - User status checks
 * - Configuration validation
 *
 * This is a thin service - most logic lives in the User entity
 */
export class UserService {
  constructor(
    private readonly userRepository: IUserRepository,
  ) {}

  static create(env: Env): UserService {
    const userRepo = new UserRepository(env.KV, env.D1);
    return new UserService(userRepo);
  }

  /**
   * Get user by platform ID
   */
  async getUser(platformUserId: string): Promise<User | null> {
    try {
      return await this.userRepository.findByPlatformId(platformUserId);
    }
    catch (error) {
      throw new UserServiceError(`Failed to get user: ${platformUserId}`, error);
    }
  }

  /**
   * Save or update user configuration
   * Returns the saved user
   */
  async saveConfiguration(platformUserId: string, config: ClaudeInstanceConfig): Promise<User> {
    try {
      const existingUser = await this.userRepository.findByPlatformId(platformUserId);

      let user: User;
      if (existingUser) {
        user = existingUser.updateConfig(config);
        console.log('Updating user configuration', { platformUserId });
      }
      else {
        user = User.create(platformUserId, config);
        console.log('Creating new user configuration', { platformUserId });
      }

      return await this.userRepository.save(user);
    }
    catch (error) {
      throw new UserServiceError(`Failed to save user configuration for: ${platformUserId}`, error);
    }
  }

  /**
   * Delete user configuration
   */
  async deleteConfiguration(platformUserId: string): Promise<void> {
    try {
      console.log('Deleting user configuration', { platformUserId });
      return await this.userRepository.deleteByPlatformId(platformUserId);
    }
    catch (error) {
      throw new UserServiceError(`Failed to delete user configuration: ${platformUserId}`, error);
    }
  }

  async isConfigured(userId: string): Promise<boolean> {
    const user = await this.userRepository.findByPlatformId(userId);
    return !!user?.config;
  }
}
