import type { UserStatus } from '@worker/infrastructure/slack-ui/types';

/**
 * Create app home blocks based on user status
 */
export function createAppHomeBlocks(
  status: UserStatus,
): any[] {
  const blocks: any[] = [];

  // Header
  blocks.push({
    type: 'header',
    text: { type: 'plain_text', text: '🏠 Kollektiv Home' },
  });

  // Add spacing after header - empty section for breathing room
  blocks.push({ type: 'section', text: { type: 'mrkdwn', text: '\n' } });

  // Configuration Status
  const isConfigured = status === 'READY';
  const configText = isConfigured
    ? '✅ *Ready to use*'
    : '⚠️ *Setup required* - Add your API keys to start';

  blocks.push({
    type: 'section',
    text: {
      type: 'mrkdwn',
      text: `⚙️ *Configuration status:*\n${configText}`,
    },
  });

  // Add spacing between sections - combination of empty section and divider
  blocks.push({ type: 'section', text: { type: 'mrkdwn', text: ' ' } });
  blocks.push({ type: 'divider' });
  blocks.push({ type: 'section', text: { type: 'mrkdwn', text: ' ' } });

  // Capabilities Section
  blocks.push({
    type: 'section',
    text: {
      type: 'mrkdwn',
      text: `🔧 *Built-in capabilities:*\n• Web scraping (Firecrawl MCP)\n• Git repository access\n• More MCP integrations to be added soon\n`,
    },
  });

  // Add spacing before Quick Actions - combination for more breathing room
  blocks.push({ type: 'section', text: { type: 'mrkdwn', text: ' ' } });
  blocks.push({ type: 'divider' });
  blocks.push({ type: 'section', text: { type: 'mrkdwn', text: ' ' } });

  // Quick Actions
  blocks.push({
    type: 'section',
    text: {
      type: 'mrkdwn',
      text: '⚡ *Quick Actions:*',
    },
  });

  const quickActions: any[] = [];

  // Configure/Update Configuration button - label changes based on status
  const configButtonText = isConfigured ? '⚙️ Update Configuration' : '⚙️ Configure';
  quickActions.push({
    type: 'button',
    text: { type: 'plain_text', text: configButtonText },
    action_id: 'open_config_modal',
    style: isConfigured ? undefined : 'primary', // Make configure primary when not Kollektiv
  });

  // Feedback
  quickActions.push({
    type: 'button',
    text: { type: 'plain_text', text: '💡 Share feedback' },
    action_id: 'open_feedback_modal',
  });

  // Help button
  quickActions.push({
    type: 'button',
    text: { type: 'plain_text', text: '❓ Get support' },
    action_id: 'show_help',
    url: 'https://conduit8.dev/support',
  });

  blocks.push({
    type: 'actions',
    elements: quickActions,
  });

  return blocks;
}
