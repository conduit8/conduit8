export function welcomeEmailTemplate(name?: string) {
  return {
    subject: 'Welcome to Kollektiv!',
    html: `
    <h1>Welcome to Kollektiv${name ? `, ${name}` : ''}!</h1>
    <p>Thank you for joining. Your async AI coworker is ready to help in Slack.</p>
    <p>The Kollektiv Team</p>
  `,
    text: `Welcome to Kollektiv${name ? `, ${name}` : ''}!\n\nThank you for joining. Your async AI coworker is ready to help in Slack.\n\nThe Kollektiv Team`,
    tags: ['welcome', 'onboarding'],
  };
}
