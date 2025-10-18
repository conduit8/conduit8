import type { AppContext } from '@worker/entrypoints/api/types';
import type { Context, Next } from 'hono';

import { HTTPException } from 'hono/http-exception';

import { UserRepository } from '@worker/infrastructure/persistence/repositories/user-repository';
import { WorkspaceRepository } from '@worker/infrastructure/persistence/repositories/workspace-installation-repository';

export async function withWorkspaceInstallationRepository(c: Context<AppContext>, next: Next): Promise<void> {
  const d1Database = c.get('d1Database');
  if (!d1Database) {
    throw new HTTPException(500, {
      message: 'Database middleware must be called before repository middleware',
    });
  }
  const repository = new WorkspaceRepository(
    c.env.KV,
    d1Database,
  );
  c.set('workspaceInstallationRepository', repository);
  await next();
}

export async function withUserClaudeConfigRepository(c: Context<AppContext>, next: Next): Promise<void> {
  const d1Database = c.get('d1Database');
  if (!d1Database) {
    throw new HTTPException(500, {
      message: 'Database middleware must be called before repository middleware',
    });
  }

  const repository = new UserRepository(
    c.env.KV,
    d1Database,
  );
  c.set('userClaudeConfigRepository', repository);
  await next();
}
