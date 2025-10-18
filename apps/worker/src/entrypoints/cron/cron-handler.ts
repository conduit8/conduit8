import { createDatabase } from '@worker/infrastructure/persistence/database';
import { userFeedback } from '@worker/infrastructure/persistence/database/schema';
import { ResendEmailService } from '@worker/infrastructure/services';
import { desc, gte } from 'drizzle-orm';

function generateFeedbackEmailHtml(feedback: any[]): string {
  const rows = feedback.map(f => `
    <tr>
      <td style="padding: 12px; border-bottom: 1px solid #eee;">
        <strong>${f.feedbackType || 'General'}</strong><br>
        ${f.message}<br>
        <small style="color: #666;">
          ${f.followUpEmail || 'No email'} • ${new Date(f.createdAt).toLocaleString()}
        </small>
      </td>
    </tr>
  `).join('');

  return `
    <div style="font-family: system-ui, -apple-system, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2>Fresh Feedback</h2>
      <table style="width: 100%; border-collapse: collapse;">
        ${rows}
      </table>
    </div>
  `;
}

export async function scheduled(
  controller: ScheduledController,
  env: Env,
  _ctx: ExecutionContext,
): Promise<void> {
  console.log('Cron triggered', {
    cron: controller.cron,
    scheduledTime: new Date(controller.scheduledTime).toISOString(),
  });

  try {
    switch (controller.cron) {
      case '0 */3 * * *': // Every 3 hours
        {
          // Check for fresh feedback (less than 3 hours old)
          const db = createDatabase(env.D1);
          const threeHoursAgo = new Date(Date.now() - 3 * 60 * 60 * 1000);

          const freshFeedback = await db
            .select()
            .from(userFeedback)
            .where(gte(userFeedback.createdAt, threeHoursAgo))
            .orderBy(desc(userFeedback.createdAt));

          // Only send email if there's fresh feedback
          if (freshFeedback.length > 0) {
            const emailService = ResendEmailService.create(env);

            await emailService.sendEmail({
              to: 'azuev@outlook.com',
              subject: `🆕 Fresh Feedback: ${freshFeedback.length} new submission${freshFeedback.length > 1 ? 's' : ''}`,
              html: generateFeedbackEmailHtml(freshFeedback),
              tags: ['feedback-notification', 'cron'],
            });

            console.log('Fresh feedback notification sent', {
              feedbackCount: freshFeedback.length,
              operation: 'feedback-notification',
            });
          }
          else {
            console.log('No fresh feedback found', {
              operation: 'feedback-check',
              threshold: '3 hours',
            });
          }
        }
        break;
      case '0 9 * * *': // Daily at 9 AM UTC (keeping existing)
        // Existing daily reminder logic can stay here
        break;
      default:
        console.warn('Unknown cron pattern received', {
          cron: controller.cron,
          operation: 'cron-unknown',
        });
        break;
    }
  }
  catch (error: unknown) {
    console.error('Error occurred during cron execution', {
      cron: controller.cron,
      error: error instanceof Error ? error.message : String(error),
      errorType: error instanceof Error ? error.constructor.name : 'UnknownError',
      stack: error instanceof Error ? error.stack : undefined,
      operation: 'cron-critical-failure',
    });

    // Re-throw to ensure it's visible in dev mode
    throw error;
  }
}
