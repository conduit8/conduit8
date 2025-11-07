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
