import type { OauthV2AccessResponse } from '@slack/web-api';

import { SlackAppInstalled } from '@worker/domain/messages/events';
import { WorkspaceValidationError } from '@worker/infrastructure/errors/infrastructure.errors';

import { AggregateRoot } from '../base.models';

export class WorkspaceInstallation extends AggregateRoot {
  readonly id: string; // Required by Entity base class

  constructor(
    public readonly teamId: string,
    public readonly teamName: string,
    public readonly slackAccessToken: string,
    public readonly botUserId: string,
    public readonly appId: string,
    public readonly scopes: string[],
    public readonly enterpriseId?: string,
    public readonly enterpriseName?: string,
    public readonly authedUserId?: string,
    public readonly authedUserToken?: string,
    public readonly createdAt: Date = new Date(),
    public readonly updatedAt: Date = new Date(),
  ) {
    super();
    this.id = teamId; // Use teamId as the entity ID
  }

  static create(response: OauthV2AccessResponse): WorkspaceInstallation {
    // Validate required fields from OAuth response
    const validationErrors: Record<string, string> = {};

    if (!response.team?.id)
      validationErrors.teamId = 'Team ID missing from OAuth response';
    if (!response.team?.name)
      validationErrors.teamName = 'Team name missing from OAuth response';
    if (!response.access_token)
      validationErrors.accessToken = 'Bot access token missing from OAuth response';
    if (!response.bot_user_id)
      validationErrors.botUserId = 'Bot user ID missing from OAuth response';
    if (!response.app_id)
      validationErrors.appId = 'App ID missing from OAuth response';

    if (Object.keys(validationErrors).length > 0) {
      throw new WorkspaceValidationError('WorkspaceInstallation validation failed', validationErrors);
    }

    // After validation, we know all required fields exist
    const installation = new WorkspaceInstallation(
      response.team!.id!,
      response.team!.name!,
      response.access_token!,
      response.bot_user_id!,
      response.app_id!,
      response.scope?.split(',') || [],
      response.enterprise?.id,
      response.enterprise?.name,
      response.authed_user?.id,
      response.authed_user?.access_token,
    );

    // Emit domain event
    installation.addEvent(new SlackAppInstalled(
      installation.teamId,
      installation.teamName,
      installation.botUserId,
      installation.appId,
      installation.scopes,
      installation.enterpriseId,
      installation.enterpriseName,
    ));

    return installation;
  }
}
