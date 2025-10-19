import type { Meta, StoryObj } from '@storybook/react';

import { HeroSection } from './hero-section';
import { LandingBackground } from './landing-background-variants';

const meta = {
  title: 'Pages/Landing/Background Variants',
  component: LandingBackground,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof LandingBackground>;

export default meta;
type Story = StoryObj<typeof meta>;

// Sample content for all variants
const SampleContent = () => (
  <div className="min-h-screen p-8">
    <HeroSection user={null} />
  </div>
);

export const Default: Story = {
  args: {
    variant: 'default',
    children: <SampleContent />,
  },
};

export const Gradient: Story = {
  args: {
    variant: 'gradient',
    children: <SampleContent />,
  },
  parameters: {
    docs: {
      description: {
        story: 'Subtle vertical gradient from background to slightly darker gray',
      },
    },
  },
};

export const Radial: Story = {
  args: {
    variant: 'radial',
    children: <SampleContent />,
  },
  parameters: {
    docs: {
      description: {
        story: 'Radial gradient with accent color hint emanating from top center',
      },
    },
  },
};

export const Dots: Story = {
  args: {
    variant: 'dots',
    children: <SampleContent />,
  },
  parameters: {
    docs: {
      description: {
        story: 'Subtle dot grid pattern for texture',
      },
    },
  },
};

export const Grid: Story = {
  args: {
    variant: 'grid',
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

export const Noise: Story = {
  args: {
    variant: 'noise',
    children: <SampleContent />,
  },
  parameters: {
    docs: {
      description: {
        story: 'Film grain texture for organic feel',
      },
    },
  },
};

export const AllVariants: Story = {
  render: () => (
    <div className="space-y-8 p-8">
      <div>
        <h3 className="mb-4">1. Default (Plain)</h3>
        <LandingBackground variant="default">
          <div className="h-96 flex items-center justify-center border border-gray-6 rounded-lg">
            <p className="text-muted-foreground">Plain background</p>
          </div>
        </LandingBackground>
      </div>

      <div>
        <h3 className="mb-4">2. Gradient (Subtle depth)</h3>
        <LandingBackground variant="gradient">
          <div className="h-96 flex items-center justify-center border border-gray-6 rounded-lg">
            <p className="text-muted-foreground">Vertical gradient</p>
          </div>
        </LandingBackground>
      </div>

      <div>
        <h3 className="mb-4">3. Radial (Accent glow)</h3>
        <LandingBackground variant="radial">
          <div className="h-96 flex items-center justify-center border border-gray-6 rounded-lg">
            <p className="text-muted-foreground">Radial with accent</p>
          </div>
        </LandingBackground>
      </div>

      <div>
        <h3 className="mb-4">4. Dots (Technical pattern)</h3>
        <LandingBackground variant="dots">
          <div className="h-96 flex items-center justify-center border border-gray-6 rounded-lg">
            <p className="text-muted-foreground">Dot grid pattern</p>
          </div>
        </LandingBackground>
      </div>

      <div>
        <h3 className="mb-4">5. Grid (Animated pattern)</h3>
        <LandingBackground variant="grid">
          <div className="h-96 flex items-center justify-center border border-gray-6 rounded-lg">
            <p className="text-muted-foreground">Animated grid with glowing squares</p>
          </div>
        </LandingBackground>
      </div>

      <div>
        <h3 className="mb-4">6. Noise (Film grain)</h3>
        <LandingBackground variant="noise">
          <div className="h-96 flex items-center justify-center border border-gray-6 rounded-lg">
            <p className="text-muted-foreground">Noise texture</p>
          </div>
        </LandingBackground>
      </div>
    </div>
  ),
};
