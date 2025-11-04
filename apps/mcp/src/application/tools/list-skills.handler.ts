import * as backendClient from '@mcp/infrastructure/backend/client';

export async function listSkillsHandler(env: Env, sessionCookie: string) {
  const result = await backendClient.getSkills(env, sessionCookie);

  if (!result.success) {
    console.error('Failed to fetch skills:', result?.error);
    return {
      content: [
        {
          type: 'text' as const,
          text: `'Failed to fetch skills'`,
        },
      ],
      isError: true,
    };
  }

  const skills = result.data.map((skill: any) => ({
    slug: skill.slug,
    name: skill.name,
    description: skill.description,
    category: skill.category,
  }));

  return {
    content: [
      {
        type: 'text' as const,
        text: JSON.stringify(skills, null, 2),
      },
    ],
  };
}
