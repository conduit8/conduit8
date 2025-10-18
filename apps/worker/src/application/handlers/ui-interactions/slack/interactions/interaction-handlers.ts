import { WebClient } from '@slack/web-api';
import { ClaudeInstanceConfig } from '@worker/domain/models';
import { SlackMessagingService } from '@worker/domain/services/messaging';

import type { CommandHandler } from '@worker/application/handlers/types';
import type { OpenConfigModal, OpenFeedbackModal, SubmitConfigModal, SubmitFeedbackModal } from '@worker/domain/messages/commands';
import type { ValidationError } from '@worker/infrastructure/errors/domain.errors';

import { FeedbackSubmitted, UserConfigurationUpdated } from '@worker/domain/messages/events';
import { UserFeedbackSchema } from '@worker/domain/models/user/user-feedback';
import { UserService } from '@worker/domain/services/user-service';
import { createDatabase } from '@worker/infrastructure/persistence/database/connection';
import { userFeedback } from '@worker/infrastructure/persistence/database/schema/user-feedback';
import { WorkspaceRepository } from '@worker/infrastructure/persistence/repositories/workspace-installation-repository';
import { mapZodErrorToSlackFields } from '@worker/infrastructure/slack-ui/mappers/validation-error-mapper';
import { createFeedbackModal } from '@worker/infrastructure/slack-ui/views/feedback-modal';
import { parseConfigModalSubmission } from '@worker/infrastructure/slack-ui/views/user-config-modal';

/**
 * Creates config and returns Slack-formatted validation errors
 * Only handles ValidationError (create() can only throw this)
 */
function createConfigAndReturnErrors(
  configData: { githubToken: string; anthropicKey: string; firecrawlKey?: string },
): { config: ClaudeInstanceConfig; errors: null } | { config: null; errors: Record<string, string> } {
  try {
    const config = ClaudeInstanceConfig.create(configData);
    return { config, errors: null };
  }
  catch (error) {
    // error can ONLY be ValidationError
    const validationError = error as ValidationError;
    const slackErrors = mapZodErrorToSlackFields(validationError.zodError!);

    // Filter undefined values
    const filteredErrors: Record<string, string> = {};
    Object.entries(slackErrors).forEach(([key, value]) => {
      if (value)
        filteredErrors[key] = value;
    });

    return { config: null, errors: filteredErrors };
  }
}

/**
 * Response types for Slack interactions
 * Must match Slack's expected response format
 */
export type InteractionResponse
  = | { response_action: 'clear' }
    | { response_action: 'errors'; errors: Record<string, string> }
    | { response_action: 'update'; view: any }
    | { response_action: 'push'; view: any };

/**
 * Handler for OpenConfigModal command
 */
export const handleOpenConfigModal: CommandHandler<OpenConfigModal, InteractionResponse> = async (command, env) => {
  const { teamId, userId, triggerId } = command;

  console.log('Opening config modal', { userId, teamId });

  try {
    // Get installation using WorkspaceRepository
    const repository = new WorkspaceRepository(env.KV, env.D1);
    const installation = await repository.findByTeamId(teamId);

    if (!installation) {
      console.error('No installation found for workspace', { teamId });
      throw new Error(`No installation found for workspace ${teamId}`);
    }

    const slack = new SlackMessagingService(new WebClient(installation.slackAccessToken));

    // Open the modal
    await slack.openUserConfigModal(triggerId, userId);

    console.log('Config modal opened successfully', { userId });
    return { result: { response_action: 'clear' }, events: [] };
  }
  catch (error) {
    console.error('Failed to open config modal', {
      userId,
      teamId,
      error: error instanceof Error ? error.message : String(error),
    });
    // Return clear to prevent Slack from showing an error to user
    return { result: { response_action: 'clear' }, events: [] };
  }
};

/**
 * Handler for SubmitConfigModal command
 */
export const handleSubmitConfigModal: CommandHandler<SubmitConfigModal, InteractionResponse> = async (command, env) => {
  const { teamId, userId, payload } = command;

  // 1. Parse submission data
  const configData = parseConfigModalSubmission(payload);

  // 2. Validate and create config (simplified with helper)
  const { config, errors } = createConfigAndReturnErrors(configData);

  if (errors) {
    console.error('Config validation failed', { errors, userId });
    return { result: { response_action: 'errors', errors }, events: [] };
  }

  // config is guaranteed to exist here

  try {
    // 3. Save user configuration
    const userService = UserService.create(env);

    await userService.saveConfiguration(userId, config);

    // Create event for configuration update
    const configEvent = new UserConfigurationUpdated(userId, teamId, 'slack');

    console.log('Configuration saved successfully', {
      userId,
      hasGithubToken: !!configData.githubToken,
      channel: configData.channel,
    });

    return { result: { response_action: 'clear' }, events: [configEvent] };
  }
  catch (error) {
    console.error('Failed to save configuration', {
      error: String(error),
      userId,
    });

    return {
      result: {
        response_action: 'errors',
        errors: {
          github_token_block: 'An error occurred saving your configuration. Please try again.',
        },
      },
      events: [],
    };
  }
};

/**
 * Handler for OpenFeedbackModal command
 */
export const handleOpenFeedbackModal: CommandHandler<OpenFeedbackModal, InteractionResponse> = async (command, env) => {
  const { teamId, userId, triggerId } = command;

  console.log('Opening feedback modal', { userId, teamId });

  try {
    // Get installation using WorkspaceRepository
    const repository = new WorkspaceRepository(env.KV, env.D1);
    const installation = await repository.findByTeamId(teamId);

    if (!installation) {
      console.error('No installation found for workspace', { teamId });
      throw new Error(`No installation found for workspace ${teamId}`);
    }

    const slack = new WebClient(installation.slackAccessToken);

    // Open the feedback modal
    const modal = createFeedbackModal();
    await slack.views.open({
      trigger_id: triggerId,
      view: modal,
    });

    console.log('Feedback modal opened successfully', { userId });
    return { result: { response_action: 'clear' }, events: [] };
  }
  catch (error) {
    console.error('Failed to open feedback modal', {
      userId,
      teamId,
      error: error instanceof Error ? error.message : String(error),
    });
    // Return clear to prevent Slack from showing an error to user
    return { result: { response_action: 'clear' }, events: [] };
  }
};

/**
 * Handler for SubmitFeedbackModal command
 */
export const handleSubmitFeedbackModal: CommandHandler<SubmitFeedbackModal, InteractionResponse> = async (command, env) => {
  const { teamId, userId, feedbackType, feedbackText, followUpEmail } = command;

  console.log('Processing feedback submission', {
    userId,
    teamId,
    feedbackType,
    feedbackLength: feedbackText.length,
  });

  try {
    // Validate feedback data
    const validationResult = UserFeedbackSchema.safeParse({
      feedbackType,
      message: feedbackText,
      followUpEmail,
    });

    if (!validationResult.success) {
      const errors: Record<string, string> = {};
      validationResult.error.issues.forEach((issue) => {
        if (issue.path[0] === 'message') {
          errors.feedback_text_block = issue.message;
        }
        else if (issue.path[0] === 'followUpEmail') {
          errors.feedback_email_block = issue.message;
        }
      });

      return { result: { response_action: 'errors', errors }, events: [] };
    }

    // Generate feedback ID using consistent format (userId-timestamp)
    const timestamp = Date.now().toString(36).toUpperCase().slice(-6);
    const feedbackId = `${userId}-${timestamp}`;

    // Save to database using Drizzle
    const db = createDatabase(env.D1);
    await db.insert(userFeedback).values({
      id: feedbackId,
      platformUserId: userId,
      teamId,
      platform: 'slack',
      message: feedbackText,
      feedbackType,
      followUpEmail,
    });

    // Create and emit FeedbackSubmitted event
    const feedbackEvent = new FeedbackSubmitted(
      feedbackId,
      userId,
      teamId,
      feedbackType,
      feedbackText,
      followUpEmail,
    );

    console.log('Feedback saved successfully', {
      feedbackId,
      userId,
      feedbackType,
    });

    // Return the event to be handled by the event bus
    return {
      result: { response_action: 'clear' },
      events: [feedbackEvent],
    };
  }
  catch (error) {
    console.error('Failed to process feedback', {
      error: String(error),
      userId,
    });

    return {
      result: {
        response_action: 'errors',
        errors: {
          feedback_text_block: 'An error occurred saving your feedback. Please try again.',
        },
      },
      events: [],
    };
  }
};
