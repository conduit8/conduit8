import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@web/ui/components/layout/containers/accordion';

import { LandingSectionWrapper } from './landing-section-wrapper';
import { SectionHeader } from './section-header';

const faqItems = [
  {
    question: 'What is Conduit8?',
    answer: 'An AI coding assistant that turns your Slack messages into shipped features. It analyzes your GitHub repos, writes code, creates PRs, updates docs, and fixes bugs - directly from Slack.',
  },
  {
    question: 'How do I use it?',
    answer: 'Install to Slack → Use.',
  },
  {
    question: 'How much does it cost?',
    answer: 'Conduit8 is in beta, so it\'s free. You incur costs on your Anthropic API key though.',
  },
  {
    question: 'Is it secure?',
    answer: 'Runs on Cloudflare. All data and credentials encrypted at rest and in transit. In short, yes.',
  },
  {
    question: 'How do I get in touch?',
    answer: 'Send your feedback to az@conduit8.dev',
  },
];

export function FAQSection() {
  return (
    <LandingSectionWrapper>
      <SectionHeader
        label="Learn more"
        title="Frequently asked questions"
        description="It's not much, but it's a start."
      />

      <Accordion type="single" collapsible className="w-full max-w-3xl">
        {faqItems.map(item => (
          <AccordionItem key={item.question} value={item.question}>
            <AccordionTrigger className="text-left">{item.question}</AccordionTrigger>
            <AccordionContent className="text-muted-foreground text-left">{item.answer}</AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </LandingSectionWrapper>
  );
}
