import type { UserStatus } from '@worker/infrastructure/slack-ui/types';

import { WebClient } from '@slack/web-api';
import { WorkspaceRepository } from '@worker/infrastructure/persistence/repositories';

import type { ChatEvent } from '@worker/domain/services/chat-service/chat-events';

import { createAppHomeBlocks } from '@worker/infrastructure/slack-ui/views/app-home';
import { buildUserConfigModal } from '@worker/infrastructure/slack-ui/views/user-config-modal';

import type { IMessagingService } from '../interfaces';
/**
 * Application service for Slack messaging operations
 * Handles modal display, error messages, and user communication
 */
// TODO: This needs to be cleaned up - orchestration vs message formatting vs sending
export class SlackMessagingService implements IMessagingService {
  constructor(
    private readonly webClient: WebClient,
  ) {}

  static async create(teamId: string, env: Env): Promise<SlackMessagingService> {
    const repo = new WorkspaceRepository(env.KV, env.D1);
    const installation = await repo.findByTeamId(teamId);
    if (!installation) {
      console.error(`Could not find installation for teamId: ${teamId}`);
      throw new Error(`Could not find installation for teamId: ${teamId}`);
    }
    const slackClient = new WebClient(installation.slackAccessToken);
    return new SlackMessagingService(slackClient);
  }

  /**
   * Sends thread started message based on user configuration status
   * Simple one-off message - either setup prompt or ready message
   */
  async sendThreadStartedMessage(
    isConfigured: boolean,
    userId: string,
    channel: string,
    threadTs: string,
  ): Promise<void> {
    try {
      if (!isConfigured) {
        // Send setup message with config button
        await this.postMessage(
          channel,
          '🔧 Kollektiv needs configuration to continue.',
          [
            {
              type: 'section',
              text: {
                type: 'mrkdwn',
                text:
                  '🔧 *Kollektiv needs configuration to continue.*\n\nConfigure your'
                  + ' Anthropic API key and optional GitHub Personal Access Token (if you need to'
                  + ' work with private repos).'
                  + ' You can later change these settings in the App Home.',
              },
            },
            {
              type: 'actions',
              elements: [
                {
                  type: 'button',
                  text: {
                    type: 'plain_text',
                    text: '⚙️ Setup Configuration',
                  },
                  style: 'primary',
                  action_id: 'open_config_modal',
                  value: JSON.stringify({ userId }),
                },
              ],
            },
            {
              type: 'context',
              elements: [
                {
                  type: 'mrkdwn',
                  text: '🔒 All credentials are encrypted and stored securely.',
                },
              ],
            },
          ],
          threadTs,
        );
      }
      else {
        // Send initial bot introduction with capabilities (muted like session_restored)
        await this.postMessage(
          channel,
          'Welcome to Kollektiv', // Provide text for notifications/screen readers
          [
            {
              type: 'context',
              elements: [{
                type: 'mrkdwn',
                text:
                'Use Kollektiv to handle your async tasks, such as:\n'
                + '• Talk to your codebase, explain logic, document flows\n'
                + '• Create code changes and open pull requests\n'
                + '• Connect to MCP servers - _requires MCP connection_\n'
                + '_This instance will auto-sleep after 20 minutes of inactivity.'
                + ' Conversation history is preserved across sessions._',
              }],
            },
          ],
          threadTs,
        );
      }
    }
    catch (error) {
      console.error('Failed to send thread started message', {
        isConfigured,
        userId,
        channel,
        error: String(error),
      });
    }
  }

  /**
   * Handles all messaging logic for a conversation
   * - Converts domain events to Slack messages
   * - Manages message formatting and thread context
   * - Handles rate limiting
   * - Manages UI interactions (thread status, error states)
   *
   * @param messageGenerator - Async generator yielding ConversationMessage events
   * @param userId - Slack user ID for context in UI elements
   * @param channel - Slack channel ID
   * @param threadTs - Optional thread timestamp for threaded messages
   * @returns Session ID and cost from the final event
   */
  async handleConversationMessages(
    messageGenerator: AsyncGenerator<ChatEvent>,
    userId: string,
    channel: string,
    threadTs?: string,
  ): Promise<{ sessionId: string; cost?: number }> {
    if (!threadTs) {
      console.error('Cannot handle messages without thread context', { userId, channel });
      throw new Error('Thread timestamp is required for message handling');
    }

    // Track processing state
    const currentStatus = 'is processing your message...';
    let isProcessingComplete = false;
    let finalSessionId: string | undefined;
    let finalCost: number | undefined;

    // Set initial status before processing
    await this.setThreadStatus(channel, threadTs, currentStatus);

    for await (const event of messageGenerator) {
      // Check for completion flag and capture session data
      if ('is_final' in event && event.is_final) {
        isProcessingComplete = true;
        if ('session_id' in event) {
          finalSessionId = event.session_id;
        }
        if ('cost' in event) {
          finalCost = event.cost;
        }
      }

      try {
        switch (event.type) {
          case 'session_restored': {
            // Send session restored message as muted/italic text
            await this.postMutedMessage(
              channel,
              '📑 Conversation history restored.',
              threadTs,
            );
            // Re-apply status after message (Slack auto-clears on message send)
            if (!isProcessingComplete && currentStatus) {
              await this.setThreadStatus(channel, threadTs, currentStatus);
            }
            break;
          }
          case 'container_started': {
            // Container started - status already set at beginning
            // Just skip this event
            break;
          }

          case 'session_restore_failed': {
            // Send session restore failed message as muted/italic text
            await this.postMutedMessage(
              channel,
              '📑 Could not restore conversation history, previous messages are not loaded into session.',
              threadTs,
            );
            // Re-apply status after message (Slack auto-clears on message send)
            if (!isProcessingComplete && currentStatus) {
              await this.setThreadStatus(channel, threadTs, currentStatus);
            }
            break;
          }

          case 'system': {
            // Log system messages but don't show to user
            console.log('System message received', {
              userId,
              channel,
              preview: event.content ? event.content.substring(0, 100) : 'No content',
            });
            break;
          }

          case 'user': {
            // Skip user messages - they're already visible in Slack
            break;
          }

          case 'assistant': {
            // Handle structured blocks from Claude
            if (event.blocks && event.blocks.length > 0) {
              for (const block of event.blocks) {
                if (block.type === 'text') {
                  // Send text as regular message
                  await this.postMessage(channel, block.text, undefined, threadTs);
                }
                else if (block.type === 'tool_use') {
                  // Send tool use as separate muted message with emoji and formatted JSON
                  const toolMessage = `🔧 *${block.name}*\n\`\`\`\n${JSON.stringify(block.input, null, 2)}\n\`\`\``;
                  await this.postMutedMessage(channel, toolMessage, threadTs);
                }
                else if (block.type === 'thinking') {
                  // Send thinking as muted message with emoji
                  const thinkingMessage = `💭 ${block.thinking}`;
                  await this.postMutedMessage(channel, thinkingMessage, threadTs);
                }

                // Re-apply status after each message
                if (!isProcessingComplete && currentStatus) {
                  await this.setThreadStatus(channel, threadTs, currentStatus);
                }
              }
            }
            // No fallback for content - Python always sends blocks now
            break;
          }

          case 'result': {
            // Result messages may contain cost information or final results
            // Format them specially if they have cost data
            if (event.cost !== undefined && event.cost > 0) {
              // Send cost information as muted message
              const costMessage = `Cost: $${event.cost.toFixed(4)}`;
              await this.postMutedMessage(
                channel,
                costMessage,
                threadTs,
              );
            }
            else if (event.content) {
              // Send result content if no cost info
              await this.postMessage(
                channel,
                event.content,
                undefined,
                threadTs,
              );
              // Re-apply status after message (Slack auto-clears on message send)
              if (!isProcessingComplete) {
                await this.setThreadStatus(channel, threadTs, currentStatus);
              }
            }
            break;
          }

          default:
            console.warn('Unhandled conversation event type', {
              type: (event as any).type,
              userId,
              channel,
            });
        }
      }
      catch (error) {
        console.error('Error handling conversation event', {
          eventType: event.type,
          userId,
          channel,
          error: String(error),
        });
        // Continue processing other events even if one fails
      }
    }

    // Validate we got a complete response
    if (!finalSessionId) {
      // Clear any lingering status
      await this.clearThreadStatus(channel, threadTs);

      // Log the failure
      console.error('Stream completed without session ID - incomplete or malformed response', {
        userId,
        channel,
        threadTs,
        wasProcessingComplete: isProcessingComplete,
      });

      // Send error message to user since they might not have received one
      await this.postMutedMessage(
        channel,
        '⚠️ Message processing was interrupted. Please try again.',
        threadTs,
      );

      // Throw to indicate failure
      throw new Error('Stream completed without session ID');
    }

    // Success - return captured session data
    return { sessionId: finalSessionId, cost: finalCost };
  }

  /**
   * Internal helper to post a message to Slack
   * Returns the thread timestamp if this creates a new thread
   */
  public async postMessage(
    channel: string,
    text: string,
    blocks?: any[],
    threadTs?: string,
  ): Promise<string | undefined> {
    try {
      const response = await this.webClient.chat.postMessage({
        channel,
        text,
        blocks,
        thread_ts: threadTs,
      });

      // Return the message timestamp (will be thread_ts for subsequent messages)
      return response.ts;
    }
    catch (error) {
      console.error('Failed to post message', {
        channel,
        threadTs,
        error: String(error),
      });
      return undefined;
    }
  }

  /**
   * Send a muted/context message using Slack's context block
   * Used for session status, cost info, and other secondary information
   */
  private async postMutedMessage(
    channel: string,
    message: string,
    threadTs?: string,
  ): Promise<string | undefined> {
    // Use context block for muted appearance
    return this.postMessage(
      channel,
      message,
      [
        {
          type: 'context',
          elements: [
            {
              type: 'mrkdwn',
              text: message,
            },
          ],
        },
      ],
      threadTs,
    );
  }

  /**
   * Sends appropriate welcome message based on user configuration status
   * - For unconfigured users: Shows setup instructions with config button
   * - For configured users: Shows ready message
   */
  async sendWelcomeMessage(userId: string, channel: string, threadTs?: string, isConfigured: boolean = false): Promise<void> {
    try {
      console.log('Sending welcome message', { userId, channel, threadTs, isConfigured });

      if (!isConfigured) {
        // Send setup message for unconfigured users
        await this.webClient.chat.postMessage({
          channel,
          thread_ts: threadTs,
          text: '🔧 Kollektiv needs configuration to continue.',
          blocks: [
            {
              type: 'section',
              text: {
                type: 'mrkdwn',
                text:
                  '🔧 *Kollektiv needs configuration to continue.*\n\nConfigure your'
                  + ' Anthropic API key and optional GitHub Personal Access Token (if you need to'
                  + ' work with private repos).'
                  + ' You can later change these settings in the App Home.',
              },
            },
            {
              type: 'actions',
              elements: [
                {
                  type: 'button',
                  text: {
                    type: 'plain_text',
                    text: '⚙️ Setup Configuration',
                  },
                  style: 'primary',
                  action_id: 'open_config_modal',
                  value: JSON.stringify({ userId }),
                },
              ],
            },
            {
              type: 'context',
              elements: [
                {
                  type: 'mrkdwn',
                  text: '🔒 All credentials are encrypted and stored securely.',
                },
              ],
            },
          ],
        });
      }
      else {
        // Send ready message for configured users
        await this.webClient.chat.postMessage({
          channel,
          thread_ts: threadTs,
          text: '👋 *Kollektiv is ready to start *\n\nWhat can I help you with?',
        });
      }

      console.log('Welcome message sent successfully', { userId, isConfigured });
    }
    catch (error) {
      console.error('Failed to send welcome message', {
        userId,
        isConfigured,
        error: String(error),
      });

      // Fallback: send simple text message
      const fallbackMessage = isConfigured
        ? 'Kollektiv is ready. How can I help you today?'
        : 'Kollektiv needs configuration to continue. Please set up your configuration. Contact support if you need help.';

      await this.sendErrorMessage(channel, fallbackMessage, threadTs);
    }
  }

  /**
   * Sends a message when user tries to interact but is not configured
   * Shows the same setup UI but with a clear message that their request cannot be processed
   */
  async sendNotConfiguredMessage(userId: string, channel: string, threadTs?: string): Promise<void> {
    try {
      console.log('Sending not configured message', { userId, channel, threadTs });

      await this.webClient.chat.postMessage({
        channel,
        thread_ts: threadTs,
        text: '❌ Your message cannot be processed - Kollektiv needs configuration.',
        blocks: [
          {
            type: 'section',
            text: {
              type: 'mrkdwn',
              text:
                '❌ *Your message cannot be processed because Kollektiv is not configured.*\n\n'
                + 'Please configure your Anthropic API key and optional GitHub Personal Access Token'
                + ' to start using Kollektiv.',
            },
          },
          {
            type: 'actions',
            elements: [
              {
                type: 'button',
                text: {
                  type: 'plain_text',
                  text: '⚙️ Setup Configuration',
                },
                style: 'primary',
                action_id: 'open_config_modal',
                value: JSON.stringify({ userId }),
              },
            ],
          },
          {
            type: 'context',
            elements: [
              {
                type: 'mrkdwn',
                text: '🔒 All credentials are encrypted and stored securely.',
              },
            ],
          },
        ],
      });

      console.log('Not configured message sent successfully', { userId });
    }
    catch (error) {
      console.error('Failed to send not configured message', {
        userId,
        error: String(error),
      });

      await this.sendErrorMessage(
        channel,
        'Your message cannot be processed. Please configure Kollektiv first.',
        threadTs,
      );
    }
  }

  /**
   * Opens the user configuration modal in response to button click
   * This method should be called from the interactions handler with a valid trigger_id
   */
  async openUserConfigModal(triggerId: string, userId: string, channel?: string): Promise<void> {
    try {
      const modal = buildUserConfigModal(userId, channel);

      await this.webClient.views.open({
        trigger_id: triggerId,
        view: modal,
      });

      console.log('Config modal opened successfully', { userId, channel });
    }
    catch (error) {
      console.error('Failed to open config modal', {
        userId,
        channel,
        error: String(error),
      });
      throw error; // Re-throw so the interaction handler can respond appropriately
    }
  }

  /**
   * Sends configuration success message
   * If channel is provided (config from thread), sends to that channel
   * Otherwise opens DM with user (config from App Home)
   */
  async sendConfigSuccessMessage(userId: string, channel?: string): Promise<void> {
    try {
      let targetChannel = channel;

      // If no channel provided (App Home config), open DM
      if (!targetChannel) {
        console.log('Opening DM for config success message', { userId });
        const dmResponse = await this.webClient.conversations.open({
          users: userId,
        });

        if (!dmResponse.ok || !dmResponse.channel?.id) {
          throw new Error('Failed to open DM conversation');
        }
        targetChannel = dmResponse.channel.id;
      }

      console.log('Sending config success message', { userId, channel: targetChannel });

      await this.webClient.chat.postMessage({
        channel: targetChannel,
        text: '✅ Configuration saved! Send any message to start your Kollektiv bot instance.',
      });

      console.log('Config success message sent successfully', { userId, channel: targetChannel });
    }
    catch (error) {
      console.error('Failed to send config success message', {
        userId,
        channel,
        error: String(error),
      });
      // Don't throw - this is a non-critical notification
    }
  }

  /**
   * Sends a simple message to the user in the thread
   */
  async sendMessage(channel: string, message: string, threadTs?: string): Promise<void> {
    try {
      await this.webClient.chat.postMessage({
        channel,
        text: message,
        thread_ts: threadTs,
      });

      console.log('Message sent', { channel, threadTs });
    }
    catch (error) {
      console.error('Failed to send message', {
        channel,
        threadTs,
        error: String(error),
      });
    }
  }

  /**
   * Sends an error message to the user in the thread
   */
  async sendErrorMessage(channel: string, errorMessage: string, threadTs?: string): Promise<void> {
    try {
      const message = `❌ ${errorMessage}`;

      await this.webClient.chat.postMessage({
        channel,
        text: message,
        thread_ts: threadTs,
      });

      console.log('Error message sent', { channel, threadTs });
    }
    catch (error) {
      console.error('Failed to send error message', {
        channel,
        threadTs,
        error: String(error),
      });
    }
  }

  /**
   * Sends container startup message to user
   */
  async sendStartupMessage(channel: string, threadTs?: string): Promise<void> {
    try {
      await this.webClient.chat.postMessage({
        channel,
        text:
          ':gear: Starting your Kollektiv bot instance... This may take 10-30 seconds. The'
          + ' container will auto-sleep after 60 minutes of inactivity.',
        thread_ts: threadTs,
      });

      console.log('Startup message sent', { channel, threadTs });
    }
    catch (error) {
      console.error('Failed to send startup message', {
        channel,
        threadTs,
        error: String(error),
      });
    }
  }

  /**
   * Updates an existing message with new content
   */
  async updateMessage(channel: string, messageTs: string, newText: string): Promise<void> {
    try {
      await this.webClient.chat.update({
        channel,
        ts: messageTs,
        text: newText,
      });

      console.log('Message updated', { channel, messageTs });
    }
    catch (error) {
      console.error('Failed to update message', {
        channel,
        messageTs,
        error: String(error),
      });
    }
  }

  /**
   * Set AI assistant thread status (e.g., "is thinking...", "is processing...")
   * Status automatically clears when app sends a reply
   */
  async setThreadStatus(channel: string, threadTs: string, status: string): Promise<void> {
    try {
      await this.webClient.assistant.threads.setStatus({
        channel_id: channel,
        thread_ts: threadTs,
        status,
      });
    }
    catch (error) {
      console.error('Failed to set thread status', {
        channel,
        threadTs,
        status,
        error: String(error),
      });
    }
  }

  /**
   * Clear AI assistant thread status
   */
  async clearThreadStatus(channel: string, threadTs: string): Promise<void> {
    try {
      await this.webClient.assistant.threads.setStatus({
        channel_id: channel,
        thread_ts: threadTs,
        status: '', // Empty string clears the status
      });
    }
    catch (error) {
      console.error('Failed to clear thread status', {
        channel,
        threadTs,
        error: String(error),
      });
    }
  }

  /**
   * Publish app home view for a user
   * Used to display the app home interface with status and quick actions
   */
  async publishAppHomeView(
    userId: string,
    status: UserStatus,
  ): Promise<void> {
    const blocks = createAppHomeBlocks(status);

    await this.webClient.views.publish({
      user_id: userId,
      view: {
        type: 'home',
        blocks,
      },
    });
  }

  /**
   * Starts an assistant thread by opening a DM with the user
   * Sends contextual ready message with repo info and reconfigure instructions
   */
  async startAssistantThread(userId: string): Promise<void> {
    try {
      console.log('Starting assistant thread', { userId });

      // Open DM conversation with the user
      const dmResponse = await this.webClient.conversations.open({
        users: userId,
      });

      if (!dmResponse.ok || !dmResponse.channel?.id) {
        throw new Error('Failed to open DM conversation');
      }

      const channelId = dmResponse.channel.id;

      // Send generic ready message
      await this.webClient.chat.postMessage({
        channel: channelId,
        text: `🎉 Your Kollektiv bot is ready!\n\nAsk me anything about your code. To reconfigure, visit the App Home.`,
      });

      console.log('Assistant thread started successfully', {
        userId,
        channel: channelId,
      });
    }
    catch (error) {
      console.error('Failed to start assistant thread', {
        userId,
        error: String(error),
      });
      throw error;
    }
  }
}
