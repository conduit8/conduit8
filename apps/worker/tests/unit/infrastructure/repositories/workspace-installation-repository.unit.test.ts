import { WorkspaceInstallation } from '@worker/domain/models/installation/workspace-installation';
import { WorkspaceRepository } from '@worker/infrastructure/persistence/repositories/workspace-installation-repository';
import { eq } from 'drizzle-orm';
import { beforeEach, describe, expect, it, vi } from 'vitest';

// Test helper - moved to top to avoid ESLint error
function createTestWorkspaceInstallation(): WorkspaceInstallation {
  return new WorkspaceInstallation(
    'T123456',
    'Test Workspace',
    'xoxb-test-token',
    'U123BOT',
    'A123456',
    ['chat:write', 'commands', 'users:read'],
    'E123456',
    'Test Enterprise',
    'U123USER',
    'xoxp-user-token',
    new Date('2023-01-01'),
    new Date('2023-01-02'),
  );
}

// Mock dependencies
const mockKv = {
  get: vi.fn(),
  put: vi.fn(),
  delete: vi.fn(),
} as unknown as KVNamespace;

const mockD1 = {
  prepare: vi.fn(() => ({
    bind: vi.fn(() => ({
      all: vi.fn().mockResolvedValue({ results: [] }),
      first: vi.fn().mockResolvedValue(null),
      run: vi.fn().mockResolvedValue({ success: true }),
    })),
    all: vi.fn().mockResolvedValue({ results: [] }),
    first: vi.fn().mockResolvedValue(null),
    run: vi.fn().mockResolvedValue({ success: true }),
  })),
} as unknown as D1Database;

// Mock Drizzle database
const mockDb = {
  select: vi.fn(),
  insert: vi.fn(),
  delete: vi.fn(),
};

// Mock drizzle
vi.mock('drizzle-orm/d1', () => ({
  drizzle: vi.fn(() => mockDb),
}));

describe('workspaceRepository', () => {
  let repository: WorkspaceRepository;

  beforeEach(() => {
    vi.clearAllMocks();

    // Setup mock chain for select
    const selectChain = {
      from: vi.fn().mockReturnThis(),
      where: vi.fn().mockReturnThis(),
      get: vi.fn(),
    };
    mockDb.select.mockReturnValue(selectChain);

    // Setup mock chain for insert
    const insertChain = {
      values: vi.fn().mockReturnThis(),
      onConflictDoUpdate: vi.fn().mockReturnThis(),
      run: vi.fn(),
    };
    mockDb.insert.mockReturnValue(insertChain);

    // Setup mock chain for delete
    const deleteChain = {
      where: vi.fn().mockReturnThis(),
      run: vi.fn(),
    };
    mockDb.delete.mockReturnValue(deleteChain);

    repository = new WorkspaceRepository(mockKv, mockD1);
  });

  describe('entity-Specific Configuration', () => {
    it('should return correct entityName', () => {
      expect((repository as any).entityName).toBe('WorkspaceInstallation');
    });

    it('should generate correct KV key', () => {
      const kvKey = (repository as any).getKvKey('T123456');
      expect(kvKey).toBe('workspace:T123456');
    });

    it('should use teamId as key string', () => {
      const keyStr = (repository as any).getKeyString('T123456');
      expect(keyStr).toBe('T123456');
    });
  });

  describe('d1 Database Operations via Drizzle', () => {
    it('should find installation from D1 using Drizzle', async () => {
      const dbResult = {
        teamId: 'T123456',
        teamName: 'Test Workspace',
        slackAccessToken: 'xoxb-test-token',
        botUserId: 'U123BOT',
        appId: 'A123456',
        scopes: ['chat:write', 'commands', 'users:read'],
        enterpriseId: 'E123456',
        enterpriseName: 'Test Enterprise',
        authedUserId: 'U123USER',
        authedUserToken: 'xoxp-user-token',
        createdAt: new Date('2023-01-01'),
        updatedAt: new Date('2023-01-02'),
      };

      const selectChain = {
        from: vi.fn().mockReturnThis(),
        where: vi.fn().mockReturnThis(),
        get: vi.fn().mockResolvedValue(dbResult),
      };
      mockDb.select.mockReturnValue(selectChain);

      const result = await (repository as any).findFromD1('T123456');

      expect(mockDb.select).toHaveBeenCalled();
      expect(selectChain.from).toHaveBeenCalled();
      expect(selectChain.where).toHaveBeenCalled();
      expect(result).toBeInstanceOf(WorkspaceInstallation);
      expect(result.teamId).toBe('T123456');
      expect(result.slackAccessToken).toBe('xoxb-test-token');
    });

    it('should return null when installation not found in D1', async () => {
      const selectChain = {
        from: vi.fn().mockReturnThis(),
        where: vi.fn().mockReturnThis(),
        get: vi.fn().mockResolvedValue(null),
      };
      mockDb.select.mockReturnValue(selectChain);

      const result = await (repository as any).findFromD1('nonexistent');

      expect(result).toBeNull();
    });

    it('should save installation to D1 using Drizzle', async () => {
      const installation = createTestWorkspaceInstallation();

      const insertChain = {
        values: vi.fn().mockReturnThis(),
        onConflictDoUpdate: vi.fn().mockReturnThis(),
        run: vi.fn().mockResolvedValue(undefined),
      };
      mockDb.insert.mockReturnValue(insertChain);

      await (repository as any).saveToD1(installation);

      expect(mockDb.insert).toHaveBeenCalled();
      expect(insertChain.values).toHaveBeenCalledWith({
        teamId: 'T123456',
        teamName: 'Test Workspace',
        slackAccessToken: 'xoxb-test-token',
        botUserId: 'U123BOT',
        appId: 'A123456',
        scopes: ['chat:write', 'commands', 'users:read'],
        enterpriseId: 'E123456',
        enterpriseName: 'Test Enterprise',
        authedUserId: 'U123USER',
        authedUserToken: 'xoxp-user-token',
        createdAt: installation.createdAt,
        updatedAt: installation.updatedAt,
      });
    });

    it('should handle null optional fields when saving to D1', async () => {
      const installation = new WorkspaceInstallation(
        'T123456',
        'Test Workspace',
        'xoxb-test-token',
        'U123BOT',
        'A123456',
        ['chat:write', 'commands', 'users:read'],
        undefined,
        undefined,
        undefined,
        undefined,
        new Date('2023-01-01'),
        new Date('2023-01-02'),
      );

      const insertChain = {
        values: vi.fn().mockReturnThis(),
        onConflictDoUpdate: vi.fn().mockReturnThis(),
        run: vi.fn().mockResolvedValue(undefined),
      };
      mockDb.insert.mockReturnValue(insertChain);

      await (repository as any).saveToD1(installation);

      expect(insertChain.values).toHaveBeenCalledWith({
        teamId: 'T123456',
        teamName: 'Test Workspace',
        slackAccessToken: 'xoxb-test-token',
        botUserId: 'U123BOT',
        appId: 'A123456',
        scopes: ['chat:write', 'commands', 'users:read'],
        enterpriseId: null,
        enterpriseName: null,
        authedUserId: null,
        authedUserToken: null,
        createdAt: installation.createdAt,
        updatedAt: installation.updatedAt,
      });
    });

    it('should delete installation from D1', async () => {
      const deleteChain = {
        where: vi.fn().mockReturnThis(),
        run: vi.fn().mockResolvedValue(undefined),
      };
      mockDb.delete.mockReturnValue(deleteChain);

      await (repository as any).deleteFromD1('T123456');

      expect(mockDb.delete).toHaveBeenCalled();
      expect(deleteChain.where).toHaveBeenCalled();
    });

    it('should check existence in D1', async () => {
      const selectChain = {
        from: vi.fn().mockReturnThis(),
        where: vi.fn().mockReturnThis(),
        get: vi.fn().mockResolvedValue({ exists: 'T123456' }),
      };
      mockDb.select.mockReturnValue(selectChain);

      const exists = await (repository as any).existsInD1('T123456');

      expect(mockDb.select).toHaveBeenCalled();
      expect(exists).toBe(true);
    });
  });

  describe('repository Interface', () => {
    it('should delegate findByTeamId to base class', async () => {
      const spy = vi.spyOn(repository as any, 'findWithCache').mockResolvedValue(null);

      await repository.findByTeamId('T123456');

      expect(spy).toHaveBeenCalledWith('T123456');
    });

    it('should delegate save to base class with correct key', async () => {
      const installation = createTestWorkspaceInstallation();
      const spy = vi.spyOn(repository as any, 'saveWithCache').mockResolvedValue(installation);

      await repository.save(installation);

      expect(spy).toHaveBeenCalledWith(installation, 'T123456');
    });

    it('should delegate delete to base class', async () => {
      const spy = vi.spyOn(repository as any, 'deleteWithCache').mockResolvedValue(undefined);

      await repository.delete('T123456');

      expect(spy).toHaveBeenCalledWith('T123456');
    });

    it('should delegate exists to base class', async () => {
      const spy = vi.spyOn(repository as any, 'existsWithCache').mockResolvedValue(true);

      await repository.exists('T123456');

      expect(spy).toHaveBeenCalledWith('T123456');
    });
  });

  describe('kV Serialization', () => {
    it('should serialize WorkspaceInstallation to JSON string', async () => {
      const installation = createTestWorkspaceInstallation();

      const result = await (repository as any).serializeForKv(installation);

      const parsed = JSON.parse(result);
      expect(parsed.teamId).toBe('T123456');
      expect(parsed.slackAccessToken).toBe('xoxb-test-token'); // No longer encrypted
    });

    it('should deserialize JSON string to WorkspaceInstallation', async () => {
      const plainObject = {
        teamId: 'T123456',
        teamName: 'Test Workspace',
        slackAccessToken: 'xoxb-test-token',
        botUserId: 'U123BOT',
        appId: 'A123456',
        scopes: ['chat:write', 'commands', 'users:read'],
        enterpriseId: 'E123456',
        enterpriseName: 'Test Enterprise',
        authedUserId: 'U123USER',
        authedUserToken: 'xoxp-user-token',
        createdAt: '2023-01-01T00:00:00.000Z',
        updatedAt: '2023-01-02T00:00:00.000Z',
      };
      const serialized = JSON.stringify(plainObject);

      const result = await (repository as any).deserializeFromKv(serialized);

      expect(result).toBeInstanceOf(WorkspaceInstallation);
      expect(result.teamId).toBe('T123456');
      expect(result.slackAccessToken).toBe('xoxb-test-token'); // No longer encrypted
    });
  });
});
