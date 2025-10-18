import { BaseCommand } from './base';

/**
 * Command to send magic link for login
 */
export class SendMagicLink extends BaseCommand {
  readonly name = 'SendMagicLink';

  constructor(
    public readonly email: string,
    public readonly magicLinkUrl: string,
    public readonly token: string,
  ) {
    super();
  }
}

/**
 * Command to track user signed up
 */
export class TrackUserSignup extends BaseCommand {
  readonly name = 'TrackUserSignup';

  constructor(
    public readonly userId: string,
  ) {
    super();
  }
}

// ============================================
// Slack Integration Commands
// ============================================

/**
 * Command to install Slack app to a workspace
 * Triggered by OAuth callback after user approves installation
 */
export class InstallSlackApp extends BaseCommand {
  readonly name = 'InstallSlackApp';

  constructor(
    public readonly oauthCode: string,
    public readonly state?: string, // Optional CSRF protection token
  ) {
    super();
  }
}

/**
 * Command to process when an assistant thread is started
 * Triggered by assistant_thread_started event
 */
export class ProcessThreadStarted extends BaseCommand {
  readonly name = 'ProcessThreadStarted';

  constructor(
    public readonly teamId: string,
    public readonly userId: string,
    public readonly channel: string,
    public readonly threadTs: string,
  ) {
    super();
  }
}

/**
 * Command to process thread context change
 * Triggered by assistant_thread_context_changed event
 * TODO: Implement handler for this command
 */
export class ProcessThreadContextChanged extends BaseCommand {
  readonly name = 'ProcessThreadContextChanged';

  constructor(
    public readonly teamId: string,
    public readonly userId: string,
    public readonly channel: string,
    public readonly threadTs: string,
  ) {
    super();
  }
}

/**
 * Command to process a user message in a conversation
 * This is the main command for handling user messages that need Claude responses
 * Orchestrates user check, conversation management, Claude streaming, and domain events
 */
export class ProcessUserMessage extends BaseCommand {
  readonly name = 'ProcessUserMessage';

  constructor(
    public readonly teamId: string,
    public readonly userId: string,
    public readonly channel: string,
    public readonly message?: string, // The user's message text
    public readonly threadTs?: string, // Thread timestamp if in a thread
  ) {
    super();
  }
}

/**
 * Command to update the App Home tab
 * Triggered when a user opens the App Home
 */
export class UpdateAppHome extends BaseCommand {
  readonly name = 'UpdateAppHome';

  constructor(
    public readonly teamId: string,
    public readonly userId: string,
  ) {
    super();
  }
}

// ============================================
// Slack Interaction Commands
// ============================================

/**
 * Command to handle opening the configuration modal
 * Triggered by block_actions when user clicks "Setup Configuration" button
 */
export class OpenConfigModal extends BaseCommand {
  readonly name = 'OpenConfigModal';

  constructor(
    public readonly teamId: string,
    public readonly userId: string,
    public readonly triggerId: string,
  ) {
    super();
  }
}

/**
 * Command to handle configuration modal submission
 * Triggered by view_submission when user submits the config modal
 */
export class SubmitConfigModal extends BaseCommand {
  readonly name = 'SubmitConfigModal';

  constructor(
    public readonly teamId: string,
    public readonly userId: string,
    public readonly payload: any, // Full payload for validation and data extraction
  ) {
    super();
  }
}

/**
 * Command to handle opening the feedback modal
 * Triggered by block_actions when user clicks "Share feedback" button
 */
export class OpenFeedbackModal extends BaseCommand {
  readonly name = 'OpenFeedbackModal';

  constructor(
    public readonly teamId: string,
    public readonly userId: string,
    public readonly triggerId: string,
  ) {
    super();
  }
}

/**
 * Command to handle feedback modal submission
 * Triggered by view_submission when user submits the feedback modal
 */
export class SubmitFeedbackModal extends BaseCommand {
  readonly name = 'SubmitFeedbackModal';

  constructor(
    public readonly teamId: string,
    public readonly userId: string,
    public readonly feedbackType: 'bug' | 'feature',
    public readonly feedbackText: string,
    public readonly followUpEmail?: string,
  ) {
    super();
  }
}
