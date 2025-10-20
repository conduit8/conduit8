import {
  HomeFooter,
  HomeHeader,
} from '@web/pages/public/home';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@web/ui/components/layout/containers/accordion';
import { PageLayout } from '@web/ui/components/layout/page/page-layout';

const faqItems = [
  {
    question: 'How do I add my Anthropic API key?',
    answer: 'Navigate to Settings in your dashboard and enter your API key in the Anthropic API Key field. Your key is encrypted and stored securely.',
  },
  {
    question: 'How do I connect MCPs?',
    answer: 'Right now, MCPs come pre-connected out of the box. We\'re planning to add more MCPs and custom configuration options soon.',
  },
  {
    question: 'Conduit8 is not responding in Slack',
    answer: 'Make sure you\'ve mentioned @conduit8 in your message. Check that your API key is configured correctly in Settings. If the issue persists, reach out via email above.',
  },
  {
    question: 'How do I remove Conduit8 from my workspace?',
    answer: 'Go to your Slack workspace settings, navigate to Apps, find Conduit8, and click Remove App. All your data will be deleted.',
  },
  {
    question: 'Is my data secure?',
    answer: 'Yes. You bring your own Anthropic API key (BYOK), so your conversations go directly to Anthropic. We don\'t store or access your API keys or conversation data.',
  },
];

export function SupportPage() {
  return (
    <PageLayout
      header={<HomeHeader />}
      footer={<HomeFooter />}
      variant="default"
      contentPadding={true}
    >
      <div className="flex flex-col gap-8 py-16">
        {/* Hero */}
        <div className="text-center">
          <h1 className="mb-4">Need Help?</h1>
          <p className="text-muted-foreground">
            Get support for Conduit8
          </p>
        </div>

        {/* Contact */}
        <div className="flex flex-col items-center gap-4 p-8 border border-border rounded-lg bg-surface/50">
          <h2 className="text-xl font-medium">Get in Touch</h2>
          <a
            href="mailto:az@conduit8.dev"
            className="text-lg font-medium hover:underline"
          >
            az@conduit8.dev
          </a>
        </div>

        {/* FAQ */}
        <div className="flex flex-col gap-6">
          <h2>Frequently Asked Questions</h2>

          <Accordion type="single" collapsible className="w-full">
            {faqItems.map(item => (
              <AccordionItem key={item.question} value={item.question}>
                <AccordionTrigger className="text-left">{item.question}</AccordionTrigger>
                <AccordionContent className="text-muted-foreground text-left">
                  {item.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </PageLayout>
  );
}
