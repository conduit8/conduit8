import type { SlackEvent } from '@slack/types';
// Slack OAuth v2.access response type
/**
 * Custom Slack types that aren't in @slack/types
 */

export interface SlackContext {
  channel: string;
  threadTs?: string; // Optional - not all messages are threaded
}

/**
 * URL verification challenge (not an actual event)
 * https://api.slack.com/events/url_verification
 */
export interface SlackUrlVerification {
  type: 'url_verification';
  token: string;
  challenge: string;
}

/**
 * Slack Events API outer event (wrapper)
 * https://api.slack.com/apis/events-api
 *
 * This is the outer JSON structure that wraps all Slack events.
 * The 'event' field contains the actual event from @slack/types
 */
export interface SlackOuterEvent {
  type: 'event_callback';
  token: string;
  team_id: string;
  api_app_id: string;
  event: SlackEvent;
  event_id: string;
  event_time: number;
  event_context?: string;
  authorizations?: Array<{
    enterprise_id: string | null;
    team_id: string;
    user_id: string;
    is_bot: boolean;
    is_enterprise_install: boolean;
  }>;
  is_ext_shared_channel?: boolean;
  context_team_id?: string;
  context_enterprise_id?: string | null;
}

/**
 * Union type for all possible Slack Events API payloads
 */
export type SlackEventPayload = SlackOuterEvent | SlackUrlVerification;
