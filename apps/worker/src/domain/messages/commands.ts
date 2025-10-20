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
// Skill Commands
// ============================================

/**
 * Command to track when a skill is downloaded
 * Increments download count for analytics
 */
export class TrackSkillDownload extends BaseCommand {
  readonly name = 'TrackSkillDownload';

  constructor(
    public readonly slug: string,
  ) {
    super();
  }
}
