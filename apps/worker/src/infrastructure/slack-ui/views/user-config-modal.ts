/**
 * Slack Block Kit modal for user Conduit8 configuration
 * Allows users to set up their GitHub token and Anthropic API key
 */

export interface UserConfigModalView {
  type: 'modal';
  callback_id: string;
  title: {
    type: 'plain_text';
    text: string;
  };
  submit: {
    type: 'plain_text';
    text: string;
  };
  close: {
    type: 'plain_text';
    text: string;
  };
  blocks: any[];
  private_metadata: string;
}

/**
 * Builds the user configuration modal for Slack
 * This modal collects GitHub token, repo URL, and Anthropic API key
 */
export function buildUserConfigModal(userId: string, channel?: string): UserConfigModalView {
  return {
    type: 'modal',
    callback_id: 'user_config_modal',
    title: {
      type: 'plain_text',
      text: 'Conduit8 Configuration',
    },
    submit: {
      type: 'plain_text',
      text: 'Save Configuration',
    },
    close: {
      type: 'plain_text',
      text: 'Cancel',
    },
    private_metadata: JSON.stringify({ userId, channel }),
    blocks: [
      // Header section
      {
        type: 'section',
        text: {
          type: 'mrkdwn',
          text:
            'Configure your Conduit8 instance. Your information is securely stored and'
            + ' encrypted in transit and at rest. You can change your settings at any time.',
        },
      },
      {
        type: 'divider',
      },

      // Anthropic API Key section
      {
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: '🔑*Anthropic API Key* \nUsage costs will be incurred on this key.',
        },
      },
      {
        type: 'input',
        block_id: 'anthropic_key_block',
        element: {
          type: 'plain_text_input',
          action_id: 'anthropic_key',
          placeholder: {
            type: 'plain_text',
            text: 'sk-ant-xxxxxxxxxxxxxxxxxxxx',
          },
          initial_value: '',
        },
        label: {
          type: 'plain_text',
          text: 'Anthropic API Key *',
        },
        hint: {
          type: 'plain_text',
          text:
            'Get your API key from: console.anthropic.com - you will be charged for Conduit8'
            + ' usage as per Anthropic billing policy with no additional fees.',
        },
        optional: false,
      },

      // GitHub PAT section
      {
        type: 'section',
        text: {
          type: 'mrkdwn',
          text:
            '🔐*GitHub Personal Access Token* \nRequired for all git operations (clone,'
            + ' commit, push, etc). Recommended content and commit permissions',
        },
      },
      {
        type: 'input',
        block_id: 'github_token_block',
        element: {
          type: 'plain_text_input',
          action_id: 'github_token',
          placeholder: {
            type: 'plain_text',
            text: 'ghp_xxxxxxxxxxxxxxxxxxxx',
          },
          initial_value: '',
        },
        label: {
          type: 'plain_text',
          text: 'GitHub Personal Access Token *',
        },
        hint: {
          type: 'plain_text',
          text:
            'Create a token at: github.com/settings/tokens with repo permissions you want'
            + ' Conduit8 instance to have.',
        },
        optional: false,
      },

      // Firecrawl API Key section
      {
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: '🔥*Firecrawl API Key* \n(Optional) For enhanced web scraping capabilities',
        },
      },
      {
        type: 'input',
        block_id: 'firecrawl_key_block',
        element: {
          type: 'plain_text_input',
          action_id: 'firecrawl_key',
          placeholder: {
            type: 'plain_text',
            text: 'fc-xxxxxxxxxxxxxxxxxxxx',
          },
          initial_value: '',
        },
        label: {
          type: 'plain_text',
          text: 'Firecrawl API Key',
        },
        hint: {
          type: 'plain_text',
          text: 'Get your API key from: firecrawl.dev - enables advanced web content extraction',
        },
        optional: true,
      },

      // Security notice
      {
        type: 'divider',
      },
      {
        type: 'context',
        elements: [
          {
            type: 'mrkdwn',
            text:
              '🔒 *Security Notice:* Your credentials are encrypted and stored securely and'
              + ' used to setup your private, secure, isolated Conduit8 instance connected to'
              + ' Slack.',
          },
        ],
      },
    ],
  };
}

/**
 * Extracts user configuration from modal submission values
 */
export interface UserConfigSubmission {
  userId: string;
  githubToken: string;
  anthropicKey: string;
  firecrawlKey?: string;
  channel?: string;
}

/**
 * Parses modal submission to extract user configuration
 */
export function parseConfigModalSubmission(payload: any): UserConfigSubmission {
  const values = payload.view.state.values;
  const privateMetadata = JSON.parse(payload.view.private_metadata);

  return {
    userId: privateMetadata.userId,
    githubToken: values.github_token_block.github_token.value.trim(),
    anthropicKey: values.anthropic_key_block.anthropic_key.value.trim(),
    firecrawlKey: values.firecrawl_key_block?.firecrawl_key?.value?.trim() || undefined,
    channel: privateMetadata.channel,
  };
}

/**
 * Validates user configuration submission
 * Returns array of error messages, empty if valid
 */
export function validateConfigSubmission(config: UserConfigSubmission): string[] {
  const errors: string[] = [];

  // GitHub token validation
  if (!config.githubToken) {
    errors.push('GitHub token is required');
  }
  else if (
    !config.githubToken.startsWith('ghp_')
    && !config.githubToken.startsWith('github_pat_')
  ) {
    errors.push('GitHub token must start with "ghp_" or "github_pat_"');
  }

  // Anthropic API key validation
  if (!config.anthropicKey) {
    errors.push('Anthropic API key is required');
  }
  else if (!config.anthropicKey.startsWith('sk-ant-')) {
    errors.push('Anthropic API key must start with "sk-ant-"');
  }

  return errors;
}
