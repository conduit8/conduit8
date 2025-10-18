import type { Meta, StoryObj } from '@storybook/react';

import { HeroSection } from '@web/pages/public/landing/components/hero-section';
import { LandingBackground } from '@web/pages/public/landing/components/landing-background-variants';

const meta = {
  title: 'Pages/Landing/Background',
  component: LandingBackground,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof LandingBackground>;

export default meta;
type Story = StoryObj<typeof meta>;

// Sample content
const SampleContent = () => (
  <div className="min-h-screen p-8">
    <HeroSection user={null} />
  </div>
);

export const AnimatedGrid: Story = {
  args: {
    children: <SampleContent />,
  },
  parameters: {
    docs: {
      description: {
        story: 'Animated grid pattern with glowing squares that fade in and out',
      },
    },
  },
};
