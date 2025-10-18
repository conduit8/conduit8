import { ArrowLeftIcon } from '@phosphor-icons/react';
import { Link } from '@tanstack/react-router';

export function PrivacyPage() {
  return (
    <>
      {/* Header */}
      <header className="section-padding">
        <div className="container-responsive flex flex-col items-center justify-between gap-md">
          <Link
            to="/"
            className="flex items-center gap-sm text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeftIcon className="h-4 w-4" />
            Back to Home
          </Link>
          {/* Page Title */}
          <h1 className="text-3xl font-bold">Privacy Policy</h1>
        </div>
      </header>

      {/* Main Content */}
      <main className="section-padding container-max-w-4xl flex-1">
        <article className="flex flex-col gap-lg">
          {/* Last Updated */}
          <div className="text-sm text-muted-foreground">Last updated: August 7, 2025</div>

          {/* Introduction */}
          <section className="flex flex-col gap-sm">
            <p>
              At Conduit8, we take your privacy seriously. This Privacy
              Policy explains how we collect, use, and protect your personal information when you
              use our AI-powered Slack integration service.
            </p>
          </section>

          {/* Section 1: Information We Collect */}
          <section className="flex flex-col gap-md">
            <h2 className="text-2xl font-bold">1. Information We Collect</h2>
            <div className="flex flex-col gap-sm">
              <h3 className="text-xl font-medium">Account Information</h3>
              <p>
                When you connect Conduit8 to your Slack workspace, we collect your Slack workspace ID,
                team information, and any preferences you configure for the AI assistant.
              </p>

              <h3 className="text-xl font-medium">Slack Messages and AI Interactions</h3>
              <p>
                We process messages sent to the Conduit8 bot in your Slack workspace and store
                conversation history to maintain context. These interactions are stored securely
                and associated with your workspace. You maintain full control and can disconnect at any time.
              </p>

              <h3 className="text-xl font-medium">Usage and Analytics Data</h3>
              <p>
                We collect analytics data through PostHog to understand how you use our service,
                including page views, feature usage, and user interactions. This helps us improve
                the service.
              </p>

              <h3 className="text-xl font-medium">Technical Information</h3>
              <p>
                We automatically collect technical information including your IP address, browser
                type, device information, and error logs through Sentry for debugging and security
                purposes.
              </p>

              <h3 className="text-xl font-medium">Payment Information</h3>
              <p>
                If you purchase credits or subscriptions, payment processing is handled by Stripe.
                We do not store credit card numbers or sensitive payment details directly.
              </p>
            </div>
          </section>

          {/* Section 2: How We Use Your Information */}
          <section className="flex flex-col gap-md">
            <h2 className="text-2xl font-bold">2. How We Use Your Information</h2>
            <div className="flex flex-col gap-sm">
              <h3 className="text-xl font-medium">Service Provision</h3>
              <p>
                We use your information to provide our core AI assistance service, including
                processing Slack messages, generating AI responses using Claude technology, and maintaining
                conversation context for better assistance.
              </p>

              <h3 className="text-xl font-medium">Communication</h3>
              <p>
                We use your Slack integration to send AI responses, task completion notifications, and
                important service updates. All notification preferences can be managed in your
                Slack workspace settings.
              </p>

              <h3 className="text-xl font-medium">Service Improvement</h3>
              <p>
                We analyze usage patterns and error data to improve our service, fix bugs, and
                develop new features. This data is aggregated and does not identify individual
                users.
              </p>

              <h3 className="text-xl font-medium">Security and Fraud Prevention</h3>
              <p>
                We use technical information and usage patterns to detect and prevent fraudulent
                activity, security threats, and service abuse.
              </p>
            </div>
          </section>

          {/* Section 3: Information Sharing and Third-Party Services */}
          <section className="flex flex-col gap-md">
            <h2 className="text-2xl font-bold">
              3. Information Sharing and Third-Party Services
            </h2>
            <div className="flex flex-col gap-sm">
              <h3 className="text-xl font-medium">Third-Party Service Providers</h3>
              <p>
                We work with third-party service providers to help us operate our platform,
                including providers for database hosting, user authentication, AI transcription services, hosting
                infrastructure, error monitoring, analytics, and payment processing. These providers
                have access to your information only as necessary to perform their functions.
              </p>

              <h3 className="text-xl font-medium">Data Sharing Limits</h3>
              <p>
                These service providers have access to your information only as necessary to perform
                their functions and are contractually obligated to protect your data. We do not
                sell, rent, or trade your personal information to third parties.
              </p>

              <h3 className="text-xl font-medium">Legal Requirements</h3>
              <p>
                We may disclose your information if required by law, legal process, or to protect
                our rights, property, or safety, or that of our users or the public.
              </p>
            </div>
          </section>

          {/* Section 4: Data Security */}
          <section className="flex flex-col gap-md">
            <h2 className="text-2xl font-bold">4. Data Security</h2>
            <div className="flex flex-col gap-sm">
              <p>
                We implement industry-standard security measures including encryption in transit and
                at rest, secure authentication, and regular security monitoring to protect your
                personal information.
              </p>
            </div>
          </section>

          {/* Section 5: Data Retention */}
          <section className="flex flex-col gap-md">
            <h2 className="text-2xl font-bold">5. Data Retention</h2>
            <div className="flex flex-col gap-sm">
              <p>
                We retain your personal information for as long as necessary to provide our services
                and comply with legal obligations. When you delete your account, we will delete your
                personal data within 30 days, except where required to retain certain information
                for legal or regulatory purposes.
              </p>

              <p>
                Analytics data may be retained in aggregated, anonymized form for service
                improvement purposes.
              </p>
            </div>
          </section>

          {/* Section 6: Your Rights and Choices */}
          <section className="flex flex-col gap-md">
            <h2 className="text-2xl font-bold">6. Your Rights and Choices</h2>
            <div className="flex flex-col gap-sm">
              <h3 className="text-xl font-medium">Account Management</h3>
              <p>
                You can access, update, or delete your personal information through your account
                settings. You can also modify your transcription preferences and notification settings at
                any time.
              </p>

              <h3 className="text-xl font-medium">Data Deletion</h3>
              <p>
                You can request complete deletion of your account and associated data by contacting
                us or using the account deletion feature in your settings.
              </p>

              <h3 className="text-xl font-medium">Communication Preferences</h3>
              <p>
                You can control your notification preferences and opt out of non-essential
                communications through your account settings or by contacting us.
              </p>

              <h3 className="text-xl font-medium">Analytics Opt-Out</h3>
              <p>
                You can opt out of analytics tracking through your browser settings or by contacting
                us to disable PostHog tracking for your account.
              </p>
            </div>
          </section>

          {/* Section 7: Cookies and Tracking Technologies */}
          <section className="flex flex-col gap-md">
            <h2 className="text-2xl font-bold">7. Cookies and Tracking Technologies</h2>
            <div className="flex flex-col gap-sm">
              <p>We use cookies and similar technologies to:</p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>Maintain your authentication session</li>
                <li>Remember your preferences</li>
                <li>Analyze usage patterns through PostHog</li>
                <li>Provide security features through Cloudflare</li>
              </ul>

              <p>
                You can control cookie settings through your browser preferences, though some
                features may not function properly if cookies are disabled.
              </p>
            </div>
          </section>

          {/* Section 8: International Data Transfers */}
          <section className="flex flex-col gap-md">
            <h2 className="text-2xl font-bold">8. International Data Transfers</h2>
            <div className="flex flex-col gap-sm">
              <p>
                Our service providers may store and process your data in various countries,
                including the United States. By using our service, you consent to such transfers in
                accordance with this Privacy Policy.
              </p>
            </div>
          </section>

          {/* Section 9: Children's Privacy */}
          <section className="flex flex-col gap-md">
            <h2 className="text-2xl font-bold">9. Children's Privacy</h2>
            <div className="flex flex-col gap-sm">
              <p>
                Our service is not directed to children under 13. We do not knowingly collect
                personal information from children under 13. If you become aware that a child has
                provided us with personal information, please contact us.
              </p>
            </div>
          </section>

          {/* Section 10: Changes to This Policy */}
          <section className="flex flex-col gap-md">
            <h2 className="text-2xl font-bold">10. Changes to This Privacy Policy</h2>
            <div className="flex flex-col gap-sm">
              <p>
                We may update this Privacy Policy from time to time to reflect changes in our
                practices or for legal and regulatory reasons. Material changes will be posted on
                this page with an updated "Last updated" date. We encourage you to review this
                policy periodically.
              </p>
            </div>
          </section>

          {/* Contact Information */}
          <section className="flex flex-col gap-md">
            <h2 className="text-2xl font-bold">11. Contact Us</h2>
            <div className="flex flex-col gap-sm">
              <p>
                If you have any questions about this Privacy Policy, our data practices, or wish to
                exercise your privacy rights, please contact us:
              </p>
              <p>
                <strong>Email:</strong>
                {' '}
                support@conduit8.dev
                <br />
                <strong>Company:</strong>
                {' '}
                Conduit8 LLC
                <br />
                <strong>Address:</strong>
                {' '}
                701 Tillery Street Unit 12, 2874, Austin, TX 78702
              </p>

              <p>
                For privacy-specific inquiries, please include "Privacy Policy" in your subject
                line.
              </p>
            </div>
          </section>
        </article>
      </main>
    </>
  );
}
