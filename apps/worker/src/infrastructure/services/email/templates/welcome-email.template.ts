export function welcomeEmailTemplate(name?: string) {
  return {
    subject: 'Welcome to Conduit8!',
    html: `
    <h1>Welcome to Conduit8${name ? `, ${name}` : ''}!</h1>
    <p>Thank you for joining. Your async AI coworker is ready to help in Slack.</p>
    <p>The Conduit8 Team</p>
  `,
    text: `Welcome to Conduit8${name ? `, ${name}` : ''}!\n\nThank you for joining. Your async AI coworker is ready to help in Slack.\n\nThe Conduit8 Team`,
    tags: ['welcome', 'onboarding'],
  };
}
