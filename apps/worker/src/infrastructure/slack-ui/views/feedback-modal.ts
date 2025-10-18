/**
 * Create feedback modal for user input
 */
export function createFeedbackModal(defaultType: 'bug' | 'feature' = 'feature'): any {
  const isBug = defaultType === 'bug';

  return {
    type: 'modal',
    callback_id: 'feedback_modal',
    title: {
      type: 'plain_text',
      text: isBug ? 'Report a Bug' : 'Suggest a Feature',
      emoji: true,
    },
    submit: {
      type: 'plain_text',
      text: isBug ? 'Report Bug' : 'Submit Idea',
      emoji: true,
    },
    close: {
      type: 'plain_text',
      text: 'Cancel',
      emoji: true,
    },
    blocks: [
      {
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: isBug
            ? '🐛 *Report a Bug*\n\nTell us what went wrong so we can fix it.'
            : '✨ *Suggest a Feature*\n\nShare your ideas to make Kollektiv better.',
        },
      },
      {
        type: 'divider',
      },
      {
        type: 'input',
        block_id: 'feedback_type_block',
        element: {
          type: 'static_select',
          action_id: 'feedback_type',
          initial_option: {
            text: { type: 'plain_text', text: isBug ? '🐛 Bug Report' : '✨ Feature Request', emoji: true },
            value: defaultType,
          },
          options: [
            {
              text: { type: 'plain_text', text: '✨ Feature Request', emoji: true },
              value: 'feature',
            },
            {
              text: { type: 'plain_text', text: '🐛 Bug Report', emoji: true },
              value: 'bug',
            },
          ],
        },
        label: {
          type: 'plain_text',
          text: 'Feedback Type',
          emoji: true,
        },
      },
      {
        type: 'input',
        block_id: 'feedback_text_block',
        element: {
          type: 'plain_text_input',
          action_id: 'feedback_text',
          multiline: true,
          min_length: 10,
          max_length: 1000,
          placeholder: {
            type: 'plain_text',
            text: isBug ? 'What happened? When did it happen?' : 'I have a genius idea...',
            emoji: true,
          },
        },
        label: {
          type: 'plain_text',
          text: 'Your Feedback',
          emoji: true,
        },
        hint: {
          type: 'plain_text',
          text: 'Be as detailed as possible (10-1000 characters)',
        },
      },
      {
        type: 'input',
        optional: true,
        block_id: 'feedback_email_block',
        element: {
          type: 'email_text_input',
          action_id: 'feedback_email',
          placeholder: {
            type: 'plain_text',
            text: 'your@email.com',
            emoji: true,
          },
        },
        label: {
          type: 'plain_text',
          text: 'Email for Follow-up',
          emoji: true,
        },
        hint: {
          type: 'plain_text',
          text: 'If you want us to follow up with you',
        },
      },
      {
        type: 'context',
        elements: [
          {
            type: 'mrkdwn',
            text: '🔒 Your feedback is private.',
          },
        ],
      },
    ],
  };
}

/**
 * Create feedback success message after submission
 */
export function createFeedbackSuccessMessage(feedbackId: string): any {
  const blocks: any[] = [
    {
      type: 'section',
      text: {
        type: 'mrkdwn',
        text: '✅ *Thank you for your feedback!*\n\nI review all feedback weekly and use it to prioritize improvements.',
      },
    },
  ];

  blocks.push({
    type: 'context',
    elements: [
      {
        type: 'mrkdwn',
        text: `Feedback ID: ${feedbackId}`,
      },
    ],
  });

  return {
    blocks,
    text: 'Thank you for your feedback!', // Fallback text
  };
}

/**
 * Parse feedback modal submission from Slack payload
 */
export function parseFeedbackModalSubmission(payload: any) {
  const values = payload.view?.state?.values || {};

  return {
    feedbackType: values.feedback_type_block?.feedback_type?.selected_option?.value || 'feature',
    message: values.feedback_text_block?.feedback_text?.value || '',
    followUpEmail: values.feedback_email_block?.feedback_email?.value || undefined,
  };
}
