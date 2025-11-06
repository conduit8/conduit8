import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { McpAgent } from 'agents/mcp';
import { z } from 'zod';

import { listSkillsHandler } from '@mcp/application/tools/list-skills.handler';
import { useSkillHandler } from '@mcp/application/tools/use-skill.handler';

// Props stored in OAuth token (encrypted)
export interface Props extends Record<string, unknown> {
  userId: string;
  email: string;
  name: string;
  sessionCookie: string;
}
// TODO: name is incorrect
export class Conduit8MCP extends McpAgent<Env, Record<string, never>, Props> {
  server = new McpServer({
    name: 'Conduit8',
    version: '0.1.0',
  });

  async init() {
    // Tool: List skills
    this.server.tool(
      'list_skills',
      'List all available Conduit8 skills',
      {},
      async () => {
        if (!this.props?.sessionCookie) {
          return {
            content: [{ type: 'text', text: 'Error: Not authenticated' }],
            isError: true,
          };
        }

        return await listSkillsHandler(this.env, this.props.sessionCookie);
      },
    );

    // Tool: Use skill
    this.server.tool(
      'use_skill',
      'Execute a Conduit8 skill with a natural language request',
      {
        skill_name: z.string().describe('The slug of the skill to execute (e.g., "pdf-extractor")'),
        request: z.string().describe('Your natural language request to the skill'),
        files: z
          .array(
            z.object({
              name: z.string().describe('File name with extension'),
              content: z.string().describe('Base64-encoded file content'),
            }),
          )
          .optional()
          .describe('Optional array of files to process'),
      },
      async (params) => {
        if (!this.props?.sessionCookie) {
          return {
            content: [{ type: 'text', text: 'Error: Not authenticated' }],
            isError: true,
          };
        }

        try {
          return await useSkillHandler(
            params as { skill_name: string; request: string; files?: Array<{ name: string; content: string }> },
            this.env,
            this.props.sessionCookie,
          );
        }
        catch (error: any) {
          if (error.message === 'SESSION_EXPIRED') {
            // Return error that will trigger re-auth
            return {
              content: [{ type: 'text', text: 'Session expired. Please re-authenticate.' }],
              isError: true,
            };
          }
          throw error;
        }
      },
    );
  }
}
