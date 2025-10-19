import type { Meta, StoryObj } from '@storybook/react-vite';

import { Button } from '@web/ui/components/atoms/buttons/button';
import { Badge } from '@web/ui/components/atoms/indicators/badge';
import { Alert, AlertDescription, AlertTitle } from '@web/ui/components/feedback/alerts/alert';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@web/ui/components/layout/containers/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@web/ui/components/overlays/dialog';

const meta: Meta = {
  title: 'Design System/Typography',
  parameters: {
    layout: 'fullscreen',
  },
};

export default meta;
type Story = StoryObj;

/**
 * App Typography
 *
 * Optimized for dashboard and application interfaces with a compact, functional scale.
 * Uses h1 (28px), h2 (24px), h3 (20px), h4 (18px), h5 (16px), h6 (14px)
 */
export const AppTypography: Story = {
  render: () => (
    <div className="bg-background mx-auto max-w-6xl p-8">
      {/* Page Header Example */}
      <section className="mb-12">
        <h1 className="mb-2">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome back! Here's what's happening with your transcriptions today.
        </p>
      </section>

      {/* Typography Scale */}
      <section className="mb-12">
        <h2 className="mb-6">Typography Scale - App Context</h2>

        <div className="bg-card space-y-6 rounded-lg border p-6">
          <div className="grid grid-cols-[200px_1fr_200px] items-baseline gap-4">
            <code className="text-muted-foreground text-xs">h1 • 28px • bold</code>
            <h1>Page Title</h1>
            <span className="text-muted-foreground text-xs">Main page heading</span>
          </div>

          <div className="grid grid-cols-[200px_1fr_200px] items-baseline gap-4">
            <code className="text-muted-foreground text-xs">h2 • 24px • bold</code>
            <h2>Section Header</h2>
            <span className="text-muted-foreground text-xs">Major sections</span>
          </div>

          <div className="grid grid-cols-[200px_1fr_200px] items-baseline gap-4">
            <code className="text-muted-foreground text-xs">h3 • 20px • bold</code>
            <h3>Subsection Title</h3>
            <span className="text-muted-foreground text-xs">Content divisions</span>
          </div>

          <div className="grid grid-cols-[200px_1fr_200px] items-baseline gap-4">
            <code className="text-muted-foreground text-xs">h4 • 18px • medium</code>
            <h4>Component Header</h4>
            <span className="text-muted-foreground text-xs">Dialog/modal titles</span>
          </div>

          <div className="grid grid-cols-[200px_1fr_200px] items-baseline gap-4">
            <code className="text-muted-foreground text-xs">h5 • 16px • medium</code>
            <h5>Card Title</h5>
            <span className="text-muted-foreground text-xs">Card headers</span>
          </div>

          <div className="grid grid-cols-[200px_1fr_200px] items-baseline gap-4">
            <code className="text-muted-foreground text-xs">h6 • 14px • medium</code>
            <h6>Small Section</h6>
            <span className="text-muted-foreground text-xs">Form sections</span>
          </div>

          <div className="grid grid-cols-[200px_1fr_200px] items-baseline gap-4">
            <code className="text-muted-foreground text-xs">p • 16px • regular</code>
            <p>Body text for primary content, descriptions, and readable text.</p>
            <span className="text-muted-foreground text-xs">Body content</span>
          </div>

          <div className="grid grid-cols-[200px_1fr_200px] items-baseline gap-4">
            <code className="text-muted-foreground text-xs">small • 14px • regular</code>
            <small>Helper text, timestamps, metadata</small>
            <span className="text-muted-foreground text-xs">Secondary info</span>
          </div>
        </div>
      </section>

      {/* Component Examples */}
      <section className="mb-12">
        <h2 className="mb-6">Components in Context</h2>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {/* Card Example */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Your transcription history from the last 7 days</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Meeting Recording.mp3</p>
                    <small className="text-muted-foreground">Processed 2 hours ago</small>
                  </div>
                  <Badge variant="default">Complete</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Interview_Final.wav</p>
                    <small className="text-muted-foreground">Processing...</small>
                  </div>
                  <Badge variant="secondary">In Progress</Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Dialog Example */}
          <Card>
            <CardHeader>
              <CardTitle>Dialog Example</CardTitle>
              <CardDescription>Modal titles use h4 (18px)</CardDescription>
            </CardHeader>
            <CardContent>
              <Dialog>
                <DialogTrigger asChild>
                  <Button>Open Dialog</Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Delete Transcription</DialogTitle>
                    <DialogDescription>
                      Are you sure you want to delete this transcription? This action cannot be
                      undone.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="mt-6 flex justify-end gap-3">
                    <Button variant="outline">Cancel</Button>
                    <Button variant="destructive">Delete</Button>
                  </div>
                </DialogContent>
              </Dialog>
            </CardContent>
          </Card>

          {/* Alert Example */}
          <Alert>
            <AlertTitle>Heads up!</AlertTitle>
            <AlertDescription>
              You have 3 transcriptions in progress. They should be ready in about 5 minutes.
            </AlertDescription>
          </Alert>

          {/* Form Section Example */}
          <Card>
            <CardHeader>
              <CardTitle>Settings</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h6 className="mb-2">Personal Information</h6>
                  <div className="space-y-2">
                    <p>John Doe</p>
                    <small className="text-muted-foreground">john.doe@example.com</small>
                  </div>
                </div>
                <div>
                  <h6 className="mb-2">Preferences</h6>
                  <div className="space-y-2">
                    <p>Language: English</p>
                    <small className="text-muted-foreground">Last updated 3 days ago</small>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Color Application Rules */}
      <section className="mb-12">
        <h2 className="mb-6">Color Application Rules</h2>

        <Card>
          <CardContent className="pt-6">
            <div className="space-y-6">
              <div>
                <h5 className="mb-3">Never Muted</h5>
                <div className="space-y-2">
                  <h1>Page Title</h1>
                  <h3>Section Header</h3>
                  <h5>Card Title</h5>
                  <Button>Primary Action</Button>
                </div>
              </div>

              <div>
                <h5 className="mb-3">Always Muted</h5>
                <div className="space-y-2">
                  <p className="text-muted-foreground">Card description text</p>
                  <small className="text-muted-foreground">Updated 2 hours ago</small>
                  <small className="text-muted-foreground">2.5 MB • 3:45 duration</small>
                  <p className="text-muted-foreground">Helper text under form fields</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Font Weights */}
      <section>
        <h2 className="mb-6">Font Weights</h2>

        <Card>
          <CardContent className="pt-6">
            <div className="space-y-3">
              <p className="font-light">Light (300) - Rarely used</p>
              <p className="font-normal">Regular (400) - Body text default</p>
              <p className="font-medium">Medium (500) - Links, strong emphasis</p>
              <p className="font-bold">Semibold (600) - Component headers</p>
              <p className="font-bold">Bold (700) - Main headings h1-h3</p>
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  ),
};

/**
 * Landing Typography
 *
 * Marketing-focused scale for landing pages with dramatic hierarchy.
 * Uses display classes and larger heading sizes for impact.
 */
export const LandingTypography: Story = {
  render: () => (
    <div className="bg-background mx-auto max-w-6xl p-8">
      {/* Hero Section Example */}
      <section className="mb-16 text-center">
        <h1 className="text-display-hero mb-4">Transform Your Audio</h1>
        <p className="text-subtitle text-muted-foreground mx-auto max-w-2xl">
          Lightning-fast transcription powered by AI. Upload your audio and get accurate transcripts
          in seconds.
        </p>
        <div className="mt-8 flex justify-center gap-4">
          <Button size="lg">Start Free Trial</Button>
          <Button size="lg" variant="outline">
            View Pricing
          </Button>
        </div>
      </section>

      {/* Full Landing Page Example with Annotations */}
      <section className="bg-muted/50 -mx-8 mb-12 rounded-lg px-8 py-12">
        <div className="mb-12 text-center">
          <code className="text-muted-foreground mb-2 block text-xs">
            className="text-display-hero" (60px, bold, -0.025em spacing)
          </code>
          <h1 className="text-display-hero mb-4">Welcome to Typist</h1>

          <code className="text-muted-foreground mb-2 block text-xs">
            className="text-subtitle text-muted-foreground" (20px, regular)
          </code>
          <p className="text-subtitle text-muted-foreground mx-auto mb-8 max-w-2xl">
            Professional transcription at the speed of thought. Turn any audio into accurate,
            searchable text.
          </p>
          <Button size="lg" className="mr-4">
            Get Started Free
          </Button>
          <Button size="lg" variant="outline">
            Watch Demo
          </Button>
        </div>
      </section>

      {/* Typography Scale */}
      <section className="mb-12">
        <h2 className="mb-6">Typography Scale - Landing Context</h2>

        <div className="bg-card space-y-6 rounded-lg border p-6">
          <div className="grid grid-cols-[250px_1fr] items-baseline gap-4">
            <code className="text-muted-foreground text-xs">text-display-hero • 60px</code>
            <h1 className="text-display-hero">Hero Headline</h1>
          </div>

          <div className="grid grid-cols-[250px_1fr] items-baseline gap-4">
            <code className="text-muted-foreground text-xs">text-display • 28px</code>
            <h2 className="text-display">Feature Section</h2>
          </div>

          <div className="grid grid-cols-[250px_1fr] items-baseline gap-4">
            <code className="text-muted-foreground text-xs">text-subtitle • 20px</code>
            <p className="text-subtitle">Subtitle text for emphasis and descriptions</p>
          </div>

          <div className="grid grid-cols-[250px_1fr] items-baseline gap-4">
            <code className="text-muted-foreground text-xs">h1 • 28px • bold</code>
            <h1>Standard H1 (App Pages)</h1>
          </div>

          <div className="grid grid-cols-[250px_1fr] items-baseline gap-4">
            <code className="text-muted-foreground text-xs">h2 • 24px • bold</code>
            <h2>Section Title</h2>
          </div>

          <div className="grid grid-cols-[250px_1fr] items-baseline gap-4">
            <code className="text-muted-foreground text-xs">h3 • 20px • medium</code>
            <h3>Feature Heading</h3>
          </div>

          <div className="grid grid-cols-[250px_1fr] items-baseline gap-4">
            <code className="text-muted-foreground text-xs">p • 16px • regular</code>
            <p>Body text for content, descriptions, and feature explanations.</p>
          </div>

          <div className="grid grid-cols-[250px_1fr] items-baseline gap-4">
            <code className="text-muted-foreground text-xs">small • 14px • regular</code>
            <small>Small text for captions, legal text, and metadata</small>
          </div>
        </div>
      </section>

      {/* Marketing Components with Annotations */}
      <section className="mb-12">
        <code className="text-muted-foreground mb-2 block text-xs">
          className="text-display" (28px, bold, -0.025em spacing)
        </code>
        <h2 className="text-display mb-8">Why Choose Typist?</h2>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          <Card>
            <CardHeader>
              <code className="text-muted-foreground mb-1 block text-xs">
                className="text-xl" (maps to h3: 20px, medium)
              </code>
              <CardTitle className="text-xl">Lightning Fast</CardTitle>
            </CardHeader>
            <CardContent>
              <code className="text-muted-foreground mb-1 block text-xs">
                &lt;p&gt; (16px, regular, 0em spacing)
              </code>
              <p>Process hours of audio in minutes with our optimized AI pipeline.</p>
              <code className="text-muted-foreground mb-1 mt-2 block text-xs">
                &lt;small&gt; + text-muted-foreground (14px)
              </code>
              <small className="text-muted-foreground mt-2 block">Powered by Whisper AI</small>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-xl">99% Accurate</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Industry-leading accuracy with support for 50+ languages and dialects.</p>
              <small className="text-muted-foreground mt-2 block">Continuously improving</small>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-xl">Secure & Private</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Your data is encrypted and never used for training. GDPR compliant.</p>
              <small className="text-muted-foreground mt-2 block">SOC 2 certified</small>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Pricing Section with Annotations */}
      <section className="mb-12 text-center">
        <code className="text-muted-foreground mb-2 block text-xs">
          className="text-display" (28px, bold)
        </code>
        <h2 className="text-display mb-4">Simple, Transparent Pricing</h2>
        <code className="text-muted-foreground mb-2 block text-xs">
          className="text-subtitle text-muted-foreground" (20px)
        </code>
        <p className="text-subtitle text-muted-foreground mb-8">
          Choose the plan that fits your needs. No hidden fees.
        </p>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          <Card>
            <CardHeader>
              <code className="text-muted-foreground mb-1 block text-xs">
                CardTitle (uses h3: 20px, medium)
              </code>
              <CardTitle>Starter</CardTitle>
              <div className="mt-4">
                <code className="text-muted-foreground mb-1 block text-xs">
                  text-3xl font-bold (28px, bold)
                </code>
                <span className="text-3xl font-bold">$9</span>
                <span className="text-muted-foreground">/month</span>
              </div>
            </CardHeader>
            <CardContent>
              <code className="text-muted-foreground mb-1 block text-xs">
                &lt;li&gt; inherits from &lt;p&gt; (16px)
              </code>
              <ul className="space-y-2 text-left">
                <li>10 hours/month</li>
                <li>Basic support</li>
                <li>Export to TXT, SRT</li>
              </ul>
              <Button className="mt-6 w-full">Get Started</Button>
            </CardContent>
          </Card>

          <Card className="border-accent">
            <CardHeader>
              <Badge className="mb-2">Most Popular</Badge>
              <CardTitle>Professional</CardTitle>
              <div className="mt-4">
                <span className="text-3xl font-bold">$29</span>
                <span className="text-muted-foreground">/month</span>
              </div>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-left">
                <li>50 hours/month</li>
                <li>Priority support</li>
                <li>All export formats</li>
                <li>API access</li>
              </ul>
              <Button className="mt-6 w-full">Get Started</Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Enterprise</CardTitle>
              <div className="mt-4">
                <span className="text-3xl font-bold">Custom</span>
              </div>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-left">
                <li>Unlimited hours</li>
                <li>Dedicated support</li>
                <li>Custom integrations</li>
                <li>SLA guarantee</li>
              </ul>
              <Button className="mt-6 w-full" variant="outline">
                Contact Sales
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* CTA Section with Annotations */}
      <section className="bg-muted rounded-lg px-8 py-12 text-center">
        <code className="text-foreground/60 mb-2 block text-xs">
          className="text-display" (28px, bold)
        </code>
        <h2 className="text-display mb-4">Ready to Get Started?</h2>
        <code className="text-foreground/60 mb-2 block text-xs">
          className="text-subtitle text-muted-foreground" (20px)
        </code>
        <p className="text-subtitle text-muted-foreground mb-8">
          Join thousands of users transcribing with Typist
        </p>
        <div className="flex justify-center gap-4">
          <Button size="lg">Start Free Trial</Button>
          <Button size="lg" variant="outline">
            Book a Demo
          </Button>
        </div>
      </section>
    </div>
  ),
};
