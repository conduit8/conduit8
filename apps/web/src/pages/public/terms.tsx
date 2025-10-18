import { ArrowLeftIcon } from '@phosphor-icons/react';
import { Link } from '@tanstack/react-router';

export const TermsPage = () => {
  return (
    <>
      {/* Header Content */}
      <header className="section-padding">
        <div className="container-responsive flex flex-col items-center gap-md">
          <Link
            to="/"
            className="flex items-center gap-sm text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeftIcon className="h-4 w-4" />
            Back to Home
          </Link>

          {/* Page Title */}
          <h1 className="text-3xl font-bold">Terms of Service</h1>
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
              Welcome to Kollektiv, operated by Kollektiv LLC ("Company", "we", "us", or "our"). These
              Terms of Service ("Terms") govern your use of our AI-powered Slack integration service. By
              accessing or using Kollektiv, you agree to be bound by these Terms.
            </p>
            <p>
              <strong>Age Requirement:</strong>
              {' '}
              You must be at least 18 years old to use this
              service. By using Kollektiv, you represent and warrant that you are 18 years of age or
              older.
            </p>
          </section>

          {/* Section 1: Service Description */}
          <section className="flex flex-col gap-md">
            <h2 className="text-2xl font-bold">1. Service Description</h2>
            <div className="flex flex-col gap-sm">
              <h3 className="text-xl font-medium">What We Provide</h3>
              <p>
                Kollektiv provides AI-powered assistance through Slack integration. Users can interact
                with Claude Code directly in their Slack workspace to automate tasks, fix bugs, and
                get development assistance. Our service brings Claude's capabilities to your team collaboration.
              </p>

              <h3 className="text-xl font-medium">Service Availability</h3>
              <p>
                While we strive for continuous availability, the service may experience
                interruptions for maintenance, updates, or unforeseen circumstances. We make no
                guarantees about uninterrupted service availability.
              </p>
            </div>
          </section>

          {/* Section 2: Important Disclaimers */}
          <section className="flex flex-col gap-md">
            <h2 className="text-2xl font-bold">2. Important Disclaimers</h2>
            <div className="flex flex-col gap-sm">
              <h3 className="text-xl font-medium">AI Response Accuracy</h3>
              <p>
                <strong>AI-GENERATED RESPONSES MAY CONTAIN ERRORS.</strong>
                {' '}
                While we use
                advanced Claude AI technology, responses are not 100% accurate and may contain
                mistakes, omissions, or misinterpretations. You should review and verify all
                AI-generated code and responses, especially for critical or production use.
              </p>

              <h3 className="text-xl font-medium">Not for Legal or Medical Use</h3>
              <p>
                Our AI assistance is not suitable for legal proceedings, medical decisions, or any
                situation requiring certified accuracy. For such purposes, please consult certified
                professionals in the relevant field.
              </p>

              <h3 className="text-xl font-medium">Content Responsibility</h3>
              <p>
                You are solely responsible for the prompts you send and code you generate. We do not
                review, endorse, or take responsibility for user interactions or generated content.
              </p>
            </div>
          </section>

          {/* Section 3: Acceptable Use */}
          <section className="flex flex-col gap-md">
            <h2 className="text-2xl font-bold">3. Acceptable Use</h2>
            <div className="flex flex-col gap-sm">
              <h3 className="text-xl font-medium">Prohibited Activities</h3>
              <p>You agree NOT to:</p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>Use the service for any illegal or unauthorized purpose</li>
                <li>Attempt to circumvent any limitations or restrictions on your account</li>
                <li>Interfere with or disrupt the service or servers</li>
                <li>Use automated means to access the service beyond normal usage</li>
                <li>Violate any applicable laws or regulations</li>
                <li>Harass, threaten, or harm others</li>
                <li>Impersonate any person or entity</li>
              </ul>

              <h3 className="text-xl font-medium">Responsible Use</h3>
              <p>
                You agree to use our service responsibly and in compliance with all applicable laws
                and regulations.
              </p>
            </div>
          </section>

          {/* Section 4: User Responsibilities */}
          <section className="flex flex-col gap-md">
            <h2 className="text-2xl font-bold">4. Your Responsibilities</h2>
            <div className="flex flex-col gap-sm">
              <h3 className="text-xl font-medium">Account Security</h3>
              <p>
                You are solely responsible for maintaining the confidentiality of your account
                credentials and for all activities under your account.
              </p>

              <h3 className="text-xl font-medium">Accurate Information</h3>
              <p>
                You agree to provide accurate and complete information when creating your account
                and to keep this information updated.
              </p>

              <h3 className="text-xl font-medium">Compliance</h3>
              <p>
                You are responsible for ensuring your use of the service complies with all
                applicable laws and regulations in your jurisdiction.
              </p>
            </div>
          </section>

          {/* Section 5: Intellectual Property */}
          <section className="flex flex-col gap-md">
            <h2 className="text-2xl font-bold">5. Intellectual Property</h2>
            <div className="flex flex-col gap-sm">
              <h3 className="text-xl font-medium">Your Content</h3>
              <p>
                You retain all ownership rights to any code, data, or other content you process through
                Kollektiv. We do not claim any ownership of your content. The AI-generated responses and
                code produced from your prompts belong to you.
              </p>

              <h3 className="text-xl font-medium">Limited License</h3>
              <p>
                By using our service, you grant us a limited, non-exclusive license to process your
                prompts and workspace data solely for the purpose of providing AI assistance. This license
                automatically terminates when you disconnect the Slack integration or delete your account.
              </p>

              <h3 className="text-xl font-medium">Our Technology</h3>
              <p>
                The Kollektiv service, including our website, software, and technology (excluding your
                content and AI-generated responses), remains the property of Kollektiv LLC. You may not
                copy, modify, or reverse engineer any part of our service.
              </p>
            </div>
          </section>

          {/* Section 6: Payment Terms */}
          <section className="flex flex-col gap-md">
            <h2 className="text-2xl font-bold">6. Fees and Payments</h2>
            <div className="flex flex-col gap-sm">
              <h3 className="text-xl font-medium">Paid Service</h3>
              <p>
                Kollektiv offers a paid subscription service. You can sign up for a monthly or yearly
                subscription that will automatically renew. You can cancel your subscription at any
                time through your account settings. Subscriptions cancelled mid-period will remain
                active until the end of the current billing period.
              </p>

              <h3 className="text-xl font-medium">Refund Policy</h3>
              <p>
                <strong>7-Day Refund Window:</strong>
                {' '}
                We offer refunds within 7 days of purchase
                for:
              </p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>Service failures or technical issues preventing transcription</li>
                <li>Billing errors or duplicate charges</li>
                <li>First-time subscribers unsatisfied with transcription quality</li>
              </ul>
              <p className="mt-2">
                <strong>No Refunds For:</strong>
                {' '}
                Successfully completed transcriptions, usage beyond
                free tier limits, or requests made after 7 days. Due to immediate AI processing
                costs, we cannot refund for buyer's remorse or changed circumstances.
              </p>
              <p className="mt-2">
                <strong>How to Request:</strong>
                {' '}
                Contact support@conduit8.dev within 7 days with
                your order details and reason for refund. We'll respond within 48 hours.
              </p>

              <h3 className="text-xl font-medium">Price Changes</h3>
              <p>
                We reserve the right to change our prices and offerings at any time. If you are on a
                subscription plan, changes to pricing will not apply until your next renewal. We
                will provide reasonable notice of any price increases.
              </p>

              <h3 className="text-xl font-medium">Taxes</h3>
              <p>
                Unless otherwise stated, fees do not include federal, state, local, and foreign
                taxes, duties, and other similar assessments ("Taxes"). You are responsible for all
                Taxes associated with your purchase. If any fees are past due, we may suspend your
                access to the service after providing written notice.
              </p>

              <h3 className="text-xl font-medium">Account Restrictions</h3>
              <p>
                You may not create multiple accounts to abuse free credits or promotional offers. If
                we believe you are not using the service in good faith, we may charge standard fees
                or terminate your access.
              </p>
            </div>
          </section>

          {/* Section 7: Indemnification */}
          <section className="flex flex-col gap-md">
            <h2 className="text-2xl font-bold">7. Indemnification</h2>
            <div className="flex flex-col gap-sm">
              <p>
                You shall defend, indemnify, and hold harmless Kollektiv, Kollektiv LLC, its affiliates
                and each of its, and its affiliates employees, contractors, directors, suppliers and
                representatives from all liabilities, losses, claims, and expenses, including
                reasonable attorneys' fees, that arise from or relate to (i) your use or misuse of,
                or access to, the Service, (ii) your violation of these Terms of Service or any
                applicable law, contract, policy, regulation or other obligation, or (iii) your
                content. We reserve the right to assume the exclusive defense and control of any
                matter otherwise subject to indemnification by you, in which event you will assist
                and cooperate with us in connection therewith.
              </p>
            </div>
          </section>

          {/* Section 8: Disclaimer */}
          <section className="flex flex-col gap-md">
            <h2 className="text-2xl font-bold">8. Disclaimer</h2>
            <div className="flex flex-col gap-sm">
              <p>
                ALL USE OF THE SERVICE AND ANY CONTENT IS UNDERTAKEN ENTIRELY AT YOUR OWN RISK. THE
                SERVICE (INCLUDING, WITHOUT LIMITATION, THE CONDUIT8 WEB APPLICATION AND ANY CONTENT)
                IS PROVIDED "AS IS" AND "AS AVAILABLE" AND IS WITHOUT WARRANTY OF ANY KIND, EXPRESS
                OR IMPLIED, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF TITLE,
                NON-INFRINGEMENT, MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE, AND ANY
                WARRANTIES IMPLIED BY ANY COURSE OF PERFORMANCE OR USAGE OF TRADE, ALL OF WHICH ARE
                EXPRESSLY DISCLAIMED. SOME STATES DO NOT ALLOW LIMITATIONS ON HOW LONG AN IMPLIED
                WARRANTY LASTS, SO THE ABOVE LIMITATIONS MAY NOT APPLY TO YOU.
              </p>
            </div>
          </section>

          {/* Section 9: Limitation of Liability */}
          <section className="flex flex-col gap-md">
            <h2 className="text-2xl font-bold">9. Limitation of Liability</h2>
            <div className="flex flex-col gap-sm">
              <p>
                IN NO EVENT SHALL CONDUIT8, KOLLEKTIV LLC OR ITS DIRECTORS, EMPLOYEES, AGENTS,
                PARTNERS, SUPPLIERS OR CONTENT PROVIDERS, BE LIABLE UNDER CONTRACT, TORT, STRICT
                LIABILITY, NEGLIGENCE OR ANY OTHER LEGAL OR EQUITABLE THEORY WITH RESPECT TO THE
                SERVICE (I) FOR ANY LOST PROFITS, DATA LOSS, COST OF PROCUREMENT OF SUBSTITUTE GOODS
                OR SERVICES, OR SPECIAL, INDIRECT, INCIDENTAL, PUNITIVE, OR CONSEQUENTIAL DAMAGES OF
                ANY KIND WHATSOEVER, OR SUBSTITUTE GOODS OR SERVICES, (II) FOR YOUR RELIANCE ON THE
                SERVICE OR (III) FOR ANY DIRECT DAMAGES IN EXCESS (IN THE AGGREGATE) OF THE FEES
                PAID BY YOU FOR THE SERVICE IN THE TWELVE MONTHS PRECEDING THE CLAIM OR, IF GREATER,
                $500. SOME STATES DO NOT ALLOW THE EXCLUSION OR LIMITATION OF INCIDENTAL OR
                CONSEQUENTIAL DAMAGES, SO THE ABOVE LIMITATIONS AND EXCLUSIONS MAY NOT APPLY TO YOU.
              </p>

              <p>
                IN NO EVENT SHALL CONDUIT8 OR KOLLEKTIV LLC BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
                LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF
                OR IN CONNECTION WITH USE OF THIS APPLICATION.
              </p>
            </div>
          </section>

          {/* Section 10: Termination */}
          <section className="flex flex-col gap-md">
            <h2 className="text-2xl font-bold">10. Termination</h2>
            <div className="flex flex-col gap-sm">
              <p>
                We may suspend or terminate your access to the service at any time, with or without
                notice, for violation of these Terms or applicable laws. You may delete your account
                at any time through your account settings.
              </p>

              <p>
                Upon termination, your right to use the service will cease immediately, and we may
                delete your account data.
              </p>
            </div>
          </section>

          {/* Section 11: Privacy */}
          <section className="flex flex-col gap-md">
            <h2 className="text-2xl font-bold">11. Privacy</h2>
            <div className="flex flex-col gap-sm">
              <p>
                Your privacy is important to us. Please review our
                {' '}
                <Link to="/privacy" className="text-accent hover:underline">
                  Privacy Policy
                </Link>
                {' '}
                to understand how we collect, use, and protect your information.
              </p>
            </div>
          </section>

          {/* Section 12: Changes to Terms */}
          <section className="flex flex-col gap-md">
            <h2 className="text-2xl font-bold">12. Changes to These Terms</h2>
            <div className="flex flex-col gap-sm">
              <p>
                We may update these Terms from time to time. Material changes will be posted on this
                page with an updated "Last updated" date. Your continued use of the service after
                changes constitutes acceptance of the new Terms.
              </p>
            </div>
          </section>

          {/* Section 13: Governing Law */}
          <section className="flex flex-col gap-md">
            <h2 className="text-2xl font-bold">13. Governing Law</h2>
            <div className="flex flex-col gap-sm">
              <p>
                These Terms are governed by the laws of the State of Wyoming, United States, without
                regard to conflict of law principles. Any disputes shall be resolved in the courts
                of Wyoming.
              </p>
            </div>
          </section>

          {/* Contact Information */}
          <section className="flex flex-col gap-md">
            <h2 className="text-2xl font-bold">14. Contact Information</h2>
            <div className="flex flex-col gap-sm">
              <p>If you have any questions about these Terms, please contact us at:</p>
              <p>
                <strong>Email:</strong>
                {' '}
                support@conduit8.dev
                <br />
                <strong>Company:</strong>
                {' '}
                Kollektiv LLC
                <br />
                <strong>Address:</strong>
                {' '}
                701 Tillery Street Unit 12, 2874, Austin, TX 78702
              </p>
            </div>
          </section>
        </article>
      </main>
    </>
  );
};
