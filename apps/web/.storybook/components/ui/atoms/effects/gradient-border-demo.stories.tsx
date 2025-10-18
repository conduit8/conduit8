import type { Meta, StoryObj } from '@storybook/react-vite';

import { PricingCard } from '@web/features/landing/components/pricing-card';
import { motion } from 'framer-motion';

const meta: Meta = {
  title: 'Effects/GradientBorderDemo',
};

export default meta;
type Story = StoryObj;

export const PricingCards: Story = {
  render: () => {
    const freeFeatures = [
      { title: '3 daily transcripts', description: 'Up to 30 minutes each', highlighted: false },
      { title: 'Access to 1 model', description: 'Access to turbo model', highlighted: false },
      { title: 'Basic export formats', description: 'TXT, SRT formats only', highlighted: false },
      {
        title: '7-day file retention',
        description: 'Files auto-delete after 7 days',
        highlighted: false,
      },
    ];

    const premiumFeatures = [
      {
        title: 'Unlimited transcriptions',
        description: 'No daily or monthly limits',
        highlighted: true,
      },
      {
        title: 'Access to all models',
        description: "World's fastest & accurate models",
        highlighted: true,
      },
      {
        title: 'Priority processing queue',
        description: 'Skip the line, always process first',
        highlighted: true,
      },
      { title: 'All export formats', description: 'PDF, DOCX, TXT, SRT', highlighted: true },
      {
        title: 'Unlimited file retention',
        description: 'Keep your files forever',
        highlighted: true,
      },
    ];

    return (
      <div className="bg-background flex min-h-screen items-center justify-center p-8">
        <div className="gap-lg mx-auto grid max-w-4xl items-center md:grid-cols-2">
          <PricingCard
            title="Free"
            price="$0"
            period="month"
            description="Perfect for trying out our service"
            features={freeFeatures}
            ctaText="Try Free Now"
            ctaLink="/dashboard"
            isPremium={false}
          />
          <PricingCard
            title="Premium"
            price="$20"
            period="month"
            description="Everything you need, unlimited"
            features={premiumFeatures}
            ctaText="Try Premium"
            ctaLink="/dashboard"
            isPremium={true}
          />
        </div>
      </div>
    );
  },
};

export const ManualGradientBorder: Story = {
  render: () => {
    return (
      <div className="bg-background flex min-h-screen items-center justify-center p-8">
        {/* Step 1: Outer card with overflow-hidden, no fill, custom radius */}
        <div className="relative h-[300px] w-[400px] overflow-hidden rounded-xl">
          {/* Step 3: Gradient element - 2x scale with conic gradient - AS A CIRCLE */}
          <motion.div
            className="absolute inset-0 scale-[2] rounded-full"
            style={{
              background:
                'conic-gradient(from 0deg at 50% 50%, transparent 0deg, transparent 180deg, #e0e7ff 210deg, #c7d2fe 240deg, #a5b4fc 270deg, #818cf8 300deg, #6366f1 330deg, #4f46e5 360deg)',
            }}
            animate={{
              rotate: 360,
            }}
            transition={{
              duration: 8,
              ease: 'linear',
              repeat: Infinity,
            }}
          />

          {/* Step 2: Inner card with padding of 4 (p-1 = 4px) */}
          <div className="bg-surface-hover absolute inset-1 rounded-lg p-8">
            <h2 className="mb-4 text-2xl font-bold">Premium Card</h2>
            <p className="text-muted-foreground">
              This card has a rotating gradient border effect created manually following your exact
              instructions.
            </p>
          </div>
        </div>
      </div>
    );
  },
};
