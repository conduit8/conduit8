import { describe, expect, it } from 'vitest';

import { listSkillsHandler } from '@mcp/application/tools/list-skills.handler';
import { useSkillHandler } from '@mcp/application/tools/use-skill.handler';

describe('Tool Handlers', () => {
  const mockEnv = { WEB_APP_BASE_URL: 'https://invalid.test' } as Env;

  it('listSkillsHandler returns error structure on failure', async () => {
    const result = await listSkillsHandler(mockEnv, 'invalid');

    expect(result).toHaveProperty('content');
    expect(result).toHaveProperty('isError', true);
    expect(result.content[0]).toHaveProperty('type', 'text');
  });

  it('useSkillHandler returns error structure on failure', async () => {
    const result = await useSkillHandler(
      { skill_name: 'test', request: 'test' },
      mockEnv,
      'invalid',
    );

    expect(result).toHaveProperty('content');
    expect(result).toHaveProperty('isError', true);
    expect(result.content[0]).toHaveProperty('type', 'text');
  });
});
