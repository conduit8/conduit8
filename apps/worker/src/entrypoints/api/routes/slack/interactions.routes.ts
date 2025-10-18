import type { BaseCommand } from '@worker/domain/messages';

import { APP_ROUTES } from '@conduit8/core';
import { Hono } from 'hono';

import type { AppContext } from '@worker/entrypoints/api/types/context';

import { MessageBus } from '@worker/application/message-bus';
import { OpenConfigModal, OpenFeedbackModal, SubmitConfigModal, SubmitFeedbackModal } from '@worker/domain/messages/commands';
import { SlackInteractionParseError } from '@worker/infrastructure/errors/infrastructure.errors';

const interactionsRoutes = new Hono<AppContext>().basePath(APP_ROUTES.api.prefix);

/**
 * Parse Slack interaction payload from FormData
 *
 * Slack sends interactions as application/x-www-form-urlencoded with a 'payload' field
 * containing JSON. This function only extracts and parses - no validation.
 *
 * @param formData - The FormData from the Slack interaction request
 * @returns Parsed JSON payload
 * @throws SlackInteractionParseError if payload is missing or invalid JSON
 */
export function parseSlackInteractionPayload(formData: FormData): any {
  const payloadStr = formData.get('payload') as string;

  if (!payloadStr) {
    throw new SlackInteractionParseError('Missing payload', 'missing_payload');
  }

  try {
    return JSON.parse(payloadStr);
  }
  catch (error) {
    throw new SlackInteractionParseError(
      'Invalid JSON payload',
      'invalid_json',
      error instanceof Error ? error : undefined,
    );
  }
}

/**
 * Mapper function: Converts Slack interactions to domain commands
 * Lives at the route level since it's mapping API layer to domain layer
 *
 * @param payload - The parsed Slack interaction payload
 * @returns Domain command or null if interaction should be ignored
 */
function createCommandFromSlackInteraction(payload: any): BaseCommand | null {
  const teamId = payload.team?.id;
  const userId = payload.user?.id;

  switch (payload.type) {
    case 'block_actions': {
      const action = payload.actions[0];
      const triggerId = payload.trigger_id;

      // Map each action_id to its corresponding command
      switch (action.action_id) {
        case 'open_config_modal':
          return new OpenConfigModal(teamId, userId, triggerId);

        case 'open_feedback_modal':
          return new OpenFeedbackModal(teamId, userId, triggerId);

        default:
          console.log('Unhandled block action', { actionId: action.action_id });
          return null;
      }
    }

    case 'view_submission': {
      const callbackId = payload.view.callback_id;

      // Map each callback_id to its corresponding command
      switch (callbackId) {
        case 'user_config_modal':
          return new SubmitConfigModal(teamId, userId, payload);

        case 'feedback_modal': {
          // Parse feedback data from modal submission - no fallbacks needed
          // Slack enforces required fields before submission
          const values = payload.view.state.values;
          const feedbackType = values.feedback_type_block.feedback_type.selected_option.value;
          const feedbackText = values.feedback_text_block.feedback_text.value;
          const followUpEmail = values.feedback_email_block?.feedback_email?.value;

          return new SubmitFeedbackModal(teamId, userId, feedbackType, feedbackText, followUpEmail);
        }

        default:
          console.log('Unhandled view submission', { callbackId });
          return null;
      }
    }

    default:
      console.log('Unhandled interaction type', { type: payload.type });
      return null;
  }
}

// Slack interactions - handle modal submissions and button clicks
interactionsRoutes.post(APP_ROUTES.api.slack.interactions, async (c) => {
  try {
    // Parse Slack interaction payload - handles FormData extraction and JSON parsing
    const formData = await c.req.formData();
    const payload = parseSlackInteractionPayload(formData);

    console.log('Slack interaction received', {
      type: payload.type,
      team_id: payload.team?.id,
      user_id: payload.user?.id,
    });

    // Convert Slack interaction to domain command
    const command = createCommandFromSlackInteraction(payload);

    if (!command) {
      // Interaction was filtered out or not handled
      return c.json({ response_action: 'clear' });
    }

    // Handle all interactions synchronously via MessageBus
    const messageBus = new MessageBus(c.env);
    const result = await messageBus.handle(command, c.env);

    // Return the command result (handler decides response format)
    return c.json(result);
  }
  catch (error) {
    // Handle all errors in one place
    if (error instanceof SlackInteractionParseError) {
      console.error('Failed to parse interaction payload', {
        errorType: error.errorType,
        message: error.message,
      });
      // No retry for parse errors - they won't succeed on retry
      return c.text('Bad Request', 400, {
        'X-Slack-No-Retry': '1',
      });
    }

    // Log unexpected errors
    console.error('Unexpected error processing interaction', {
      error: String(error),
    });
    // No retry - we've logged the error and don't want duplicates
    return c.text('Internal Server Error', 500, {
      'X-Slack-No-Retry': '1',
    });
  }
});

export default interactionsRoutes;
