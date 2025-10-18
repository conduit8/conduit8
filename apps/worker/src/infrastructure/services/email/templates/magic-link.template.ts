export function magicLinkEmailTemplate(url: string) {
  return {
    subject: 'Sign in to Conduit8',
    html: `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <title>Sign in to Conduit8</title>
      </head>
      <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #000; font-size: 24px; font-weight: 600; margin: 0;">Conduit8</h1>
        </div>

        <div style="background: #ffffff; border: 1px solid #e5e5e5; border-radius: 8px; padding: 30px;">
          <h2 style="color: #000; font-size: 20px; margin-top: 0; margin-bottom: 20px;">Sign in to your account</h2>

          <p style="color: #666; margin-bottom: 25px;">Click the button below to sign in to your Conduit8 account. This link will expire in 5 minutes.</p>

          <div style="text-align: center; margin: 30px 0;">
            <a href="${url}" style="display: inline-block; background: #000; color: #fff; text-decoration: none; padding: 12px 30px; border-radius: 6px; font-weight: 500; font-size: 16px;">Sign in to Conduit8</a>
          </div>

          <p style="color: #999; font-size: 14px; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e5e5;">
            If you didn't request this email, you can safely ignore it.
          </p>
        </div>

        <p style="text-align: center; color: #999; font-size: 12px; margin-top: 20px;">
          © ${new Date().getFullYear()} Conduit8. All rights reserved.
        </p>
      </body>
    </html>
  `,
    text: `Sign in to your Conduit8 account

Click the link below to sign in:
${url}

This link will expire in 5 minutes.

If you didn't request this email, you can safely ignore it.

© ${new Date().getFullYear()} Conduit8. All rights reserved.`,
    tags: ['auth', 'magic-link'],
  };
}
