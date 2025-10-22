import { describe, expect, it } from 'vitest';

import { WorkspaceInstallation } from '@worker/domain/models';
import { WorkspaceValidationError } from '@worker/infrastructure/errors/infrastructure.errors';

import { SlackOAuthFactory } from '../../../factories/slack-oauth.factory';

describe('workspaceInstallation', () => {
  describe('fromSlackResponse', () => {
    it('creates installation from valid OAuth response', () => {
      const response = SlackOAuthFactory.validResponse();
      const installation = WorkspaceInstallation.create(response);

      expect(installation.teamId).toBe('T123456789');
      expect(installation.teamName).toBe('Test Workspace');
      expect(installation.slackAccessToken).toBe('xoxb-test-token');
      expect(installation.botUserId).toBe('U123456789');
      expect(installation.scopes).toEqual(['chat:write', 'channels:read']);
    });

    it('throws validation error for missing team ID', () => {
      const response = SlackOAuthFactory.invalidResponse('team.id');

      expect(() => WorkspaceInstallation.create(response)).toThrow(
        WorkspaceValidationError,
      );
    });

    it('throws validation error for missing team name', () => {
      const response = SlackOAuthFactory.invalidResponse('team.name');

      expect(() => WorkspaceInstallation.create(response)).toThrow(
        WorkspaceValidationError,
      );
    });

    it('throws validation error for missing access token', () => {
      const response = SlackOAuthFactory.invalidResponse('access_token');

      expect(() => WorkspaceInstallation.create(response)).toThrow(
        WorkspaceValidationError,
      );
    });
  });
});
