import { Resend } from 'resend';

import { EmailServiceError } from '@worker/infrastructure/errors/infrastructure.errors';

import type { IEmailService } from '../interfaces';

export class ResendEmailService implements IEmailService {
  private readonly resend: Resend;
  private readonly fromAddress = 'Conduit8 <hello@mail.conduit8.dev>';

  constructor(apiKey: string) {
    if (!apiKey) {
      throw new EmailServiceError('Resend API key is required', 'configuration', 'Resend');
    }
    this.resend = new Resend(apiKey);
  }

  static create(env: Env): ResendEmailService {
    return new ResendEmailService(env.RESEND_API_KEY);
  }

  /**
   * Converts HTML to plain text by stripping tags
   */
  private htmlToPlainText(html: string): string {
    return html
      .replace(/<style[^>]*>.*?<\/style>/gi, '')
      .replace(/<script[^>]*>.*?<\/script>/gi, '')
      .replace(/<[^>]+>/g, '')
      .replace(/&nbsp;/g, ' ')
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, '\'')
      .replace(/\n\s*\n\s*\n/g, '\n\n')
      .trim();
  }

  async sendEmail(options: {
    to: string | string[];
    subject: string;
    html: string;
    text?: string;
    replyTo?: string;
    tags?: string[];
  }): Promise<{ id: string; success: boolean }> {
    try {
      // Auto-generate plain text if not provided
      const plainText = options.text || this.htmlToPlainText(options.html);

      const result = await this.resend.emails.send({
        from: this.fromAddress,
        to: options.to,
        subject: options.subject,
        html: options.html,
        text: plainText,
        replyTo: options.replyTo,
        tags: options.tags?.map(tag => ({ name: tag, value: tag })),
        headers: {
          'List-Unsubscribe': '<mailto:unsubscribe@mail.conduit8.dev>',
        },
      });

      console.log('Email sent successfully', {
        to: options.to,
        subject: options.subject,
        messageId: result.data?.id,
        tags: options.tags,
      });

      return {
        id: result.data?.id || '',
        success: true,
      };
    }
    catch (error) {
      console.error('Failed to send email', {
        to: options.to,
        subject: options.subject,
        error: error instanceof Error ? error.message : String(error),
      });

      throw new EmailServiceError(
        `Failed to send email to ${options.to}`,
        'send',
        'Resend',
        error instanceof Error ? error : new Error(String(error)),
      );
    }
  }
}
