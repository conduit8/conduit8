import * as backendClient from '@mcp/infrastructure/backend/client';

export async function listSkillsHandler(env: Env, sessionCookie: string) {
  try {
    const result = await backendClient.getSkills(env, sessionCookie);

    return {
      content: [
        {
          type: 'text' as const,
          text: JSON.stringify(result.data, null, 2),
        },
      ],
    };
  }
  catch (error: any) {
    return {
      content: [
        {
          type: 'text' as const,
          text: `Failed to fetch skills: ${error.message}`,
        },
      ],
      isError: true,
    };
  }
}
