import { WorkspaceInstallation } from '@worker/domain/models';
import { eq } from 'drizzle-orm';
import { drizzle } from 'drizzle-orm/d1';

import type { IWorkspaceInstallationRepository } from '@worker/domain/repositories/interfaces';
import type { WorkspaceInstallationInsert, WorkspaceInstallationSelect } from '@worker/infrastructure/persistence/database/schema/installations';

import { workspaceInstallations } from '@worker/infrastructure/persistence/database/schema/installations';

import { CfCacheRepository } from './cf-cache-repository';

export class WorkspaceRepository
  extends CfCacheRepository<WorkspaceInstallation, string>
  implements IWorkspaceInstallationRepository {
  private readonly db;

  constructor(
    kv: KVNamespace, // CLAUDE_PORTABLE_KV
    d1: D1Database, // DB
  ) {
    super(kv);
    this.db = drizzle(d1);
  }

  // ========== Repository Interface (PUBLIC) ==========
  async findByTeamId(teamId: string): Promise<WorkspaceInstallation | null> {
    return this.findWithCache(teamId);
  }

  async save(installation: WorkspaceInstallation): Promise<WorkspaceInstallation> {
    return this.saveWithCache(installation, installation.teamId);
  }

  async delete(teamId: string): Promise<void> {
    return this.deleteWithCache(teamId);
  }

  async exists(teamId: string): Promise<boolean> {
    return this.existsWithCache(teamId);
  }

  // ========== Abstract Implementation (PRIVATE) ==========
  protected get entityName(): string {
    return 'WorkspaceInstallation';
  }

  protected getKeyString(teamId: string): string {
    return teamId;
  }

  protected getKvKey(teamId: string): string {
    return `workspace:${teamId}`;
  }

  protected async serializeForKv(installation: WorkspaceInstallation): Promise<string> {
    // Convert domain → DB structure → JSON string for KV storage
    const dbRow = this.toPersistence(installation);
    return JSON.stringify(dbRow);
  }

  protected async deserializeFromKv(data: string): Promise<WorkspaceInstallation> {
    // Parse JSON and reconstruct dates
    const parsed = JSON.parse(data);
    // Convert ISO strings back to Date objects for domain model
    const dbRow: WorkspaceInstallationSelect = {
      ...parsed,
      createdAt: new Date(parsed.createdAt),
      updatedAt: new Date(parsed.updatedAt),
    };
    return this.toDomain(dbRow);
  }

  protected async findFromD1(teamId: string): Promise<WorkspaceInstallation | null> {
    const result = await this.db
      .select()
      .from(workspaceInstallations)
      .where(eq(workspaceInstallations.teamId, teamId))
      .get();

    return result ? this.toDomain(result) : null;
  }

  protected async saveToD1(installation: WorkspaceInstallation): Promise<void> {
    const dbRow = this.toPersistence(installation);

    await this.db
      .insert(workspaceInstallations)
      .values(dbRow)
      .onConflictDoUpdate({
        target: workspaceInstallations.teamId,
        set: {
          teamName: dbRow.teamName,
          slackAccessToken: dbRow.slackAccessToken,
          botUserId: dbRow.botUserId,
          appId: dbRow.appId,
          scopes: dbRow.scopes,
          enterpriseId: dbRow.enterpriseId,
          enterpriseName: dbRow.enterpriseName,
          authedUserId: dbRow.authedUserId,
          authedUserToken: dbRow.authedUserToken,
          updatedAt: dbRow.updatedAt,
        },
      })
      .run();
  }

  protected async deleteFromD1(teamId: string): Promise<void> {
    await this.db
      .delete(workspaceInstallations)
      .where(eq(workspaceInstallations.teamId, teamId))
      .run();
  }

  protected async existsInD1(teamId: string): Promise<boolean> {
    const result = await this.db
      .select({ exists: workspaceInstallations.teamId })
      .from(workspaceInstallations)
      .where(eq(workspaceInstallations.teamId, teamId))
      .get();
    return result !== null;
  }

  // ========== Mapper Methods (Private Implementation Details) ==========

  /**
   * Maps domain aggregate to database row structure
   */
  private toPersistence(installation: WorkspaceInstallation): WorkspaceInstallationInsert {
    return {
      teamId: installation.teamId,
      teamName: installation.teamName,
      slackAccessToken: installation.slackAccessToken,
      botUserId: installation.botUserId,
      appId: installation.appId,
      scopes: installation.scopes,
      enterpriseId: installation.enterpriseId ?? null,
      enterpriseName: installation.enterpriseName ?? null,
      authedUserId: installation.authedUserId ?? null,
      authedUserToken: installation.authedUserToken ?? null,
      createdAt: installation.createdAt,
      updatedAt: installation.updatedAt,
    };
  }

  /**
   * Reconstructs domain aggregate from database row
   */
  private toDomain(dbRow: WorkspaceInstallationSelect): WorkspaceInstallation {
    return new WorkspaceInstallation(
      dbRow.teamId,
      dbRow.teamName,
      dbRow.slackAccessToken,
      dbRow.botUserId,
      dbRow.appId,
      dbRow.scopes,
      dbRow.enterpriseId ?? undefined,
      dbRow.enterpriseName ?? undefined,
      dbRow.authedUserId ?? undefined,
      dbRow.authedUserToken ?? undefined,
      dbRow.createdAt,
      dbRow.updatedAt,
    );
  }
}
