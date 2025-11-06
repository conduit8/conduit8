import * as backendClient from '@mcp/infrastructure/backend/client';

export async function useSkillHandler(
  params: {
    skill_name: string;
    request: string;
    files?: Array<{ name: string; content: string }>;
  },
  env: Env,
  sessionCookie: string,
) {
  try {
    const result = await backendClient.executeSkill(
      params.skill_name,
      params.request,
      params.files,
      env,
      sessionCookie,
    );

    if (!result.success) {
      return {
        content: [
          {
            type: 'text' as const,
            text: `Error: ${result.error || 'Failed to execute skill'}`,
          },
        ],
        isError: true,
      };
    }

    return {
      content: [
        {
          type: 'text' as const,
          text: result.data.result,
        },
      ],
    };
  }
  catch (error: any) {
    if (error.message === 'SESSION_EXPIRED') {
      throw error; // Let MCP server handle session expiration
    }

    return {
      content: [
        {
          type: 'text' as const,
          text: `Error executing skill: ${error.message}`,
        },
      ],
      isError: true,
    };
  }
}
