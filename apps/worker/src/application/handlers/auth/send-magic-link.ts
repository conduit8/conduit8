import type { CommandHandler } from '@worker/application/handlers/types';
import type { SendMagicLink } from '@worker/domain/messages/commands';

import { ResendEmailService } from '@worker/infrastructure/services/email/resend-email-service';
import { magicLinkEmailTemplate } from '@worker/infrastructure/services/email/templates/magic-link.template';

export const sendMagicLink: CommandHandler<SendMagicLink, void> = async (
  command: SendMagicLink,
  env: Env,
) => {
  const emailService = ResendEmailService.create(env);
  const template = magicLinkEmailTemplate(command.magicLinkUrl);

  await emailService.sendEmail({
    to: command.email,
    subject: template.subject,
    html: template.html,
    text: template.text,
    tags: template.tags,
  });

  return {
    result: undefined,
    events: [],
  };
};
