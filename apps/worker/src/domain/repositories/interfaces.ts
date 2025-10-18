import type { Conversation, PlatformContext, User, WorkspaceInstallation } from '@worker/domain/models';

/**
 * Repository for Conversation persistence
 *
 * Handles two storage concerns:
 * 1. Conversation entities (KV + D1) - metadata and session mappings
 * 2. Session history (R2) - JSONL conversation history
 */
export interface IConversationRepository {
  // ========== Primary Domain Operations ==========

  /**
   * Find conversation by business key (user + platform context)
   * This is the primary lookup method for conversations
   */
  findByUserAndContext: (
    userId: string,
    context: PlatformContext
  ) => Promise<Conversation | null>;

  /**
   * Save or update conversation entity
   * Handles both KV cache and D1 persistence
   */
  save: (conversation: Conversation) => Promise<void>;

  /**
   * Delete conversation entity
   * Requires the full conversation object for proper cleanup
   */
  deleteConversation: (conversation: Conversation) => Promise<void>;

  // ========== Session History Operations (R2) ==========

  /**
   * Get session history from R2
   * Used for restoring conversation context to container
   */
  getSessionHistory: (
    userId: string,
    sessionId: string
  ) => Promise<{ data: ArrayBuffer; projectId: string } | null>;

  /**
   * Save session history to R2
   * Stores the JSONL conversation data
   */
  saveSessionHistory: (
    userId: string,
    sessionId: string,
    data: ArrayBuffer,
    projectId: string
  ) => Promise<void>;

  /**
   * Delete session history from R2
   */
  deleteSessionHistory: (
    userId: string,
    sessionId: string
  ) => Promise<void>;
}

export interface IUserRepository {
  save: (user: User) => Promise<User>;

  findByPlatformId: (platformUserId: string) => Promise<User | null>;

  deleteByPlatformId: (platformUserId: string) => Promise<void>;

  exists: (platformUserId: string) => Promise<boolean>;
}

export interface IWorkspaceInstallationRepository {
  save: (installation: WorkspaceInstallation) => Promise<WorkspaceInstallation>;

  findByTeamId: (teamId: string) => Promise<WorkspaceInstallation | null>;

  delete: (teamId: string) => Promise<void>;

  exists: (teamId: string) => Promise<boolean>;

}
