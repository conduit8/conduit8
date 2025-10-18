import type { Meta, StoryObj } from '@storybook/react-vite';

import { DotBackground } from './DotBackground';

const meta = {
  title: 'Components/Atoms/Backgrounds',
  component: DotBackground,
  parameters: {
    layout: 'fullscreen',
  },
  argTypes: {
    dotSize: {
      control: { type: 'range', min: 10, max: 50, step: 5 },
    },
    fadeIntensity: {
      control: { type: 'range', min: 0, max: 100, step: 10 },
    },
    dotColor: {
      control: 'select',
      options: {
        'Border Interactive (Default)': 'var(--border-interactive)',
        Border: 'var(--border)',
        'Border Strong': 'var(--border-interactive-strong)',
        'Muted Foreground': 'var(--muted-foreground)',
        'Surface Hover': 'var(--surface-hover)',
        'Surface Active': 'var(--surface-active)',
        Accent: 'var(--accent)',
        Primary: 'var(--primary)',
      },
    },
  },
} satisfies Meta<typeof DotBackground>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    className: 'h-96',
    children: (
      <div className="flex h-full items-center justify-center">
        <h1 className="text-4xl font-bold">Dot Background</h1>
      </div>
    ),
  },
};

export const HeroSection: Story = {
  args: {
    className: 'h-screen',
    dotSize: 30,
    fadeIntensity: 30,
    children: (
      <div className="flex h-full flex-col items-center justify-center gap-4 px-8">
        <h1 className="text-6xl font-bold">Welcome to Typist</h1>
        <p className="text-muted-foreground text-xl">
          Transform your audio into perfect transcripts
        </p>
        <button className="bg-primary text-primary-foreground mt-8 rounded-lg px-8 py-3">
          Get Started
        </button>
      </div>
    ),
  },
};

export const SubtleDots: Story = {
  args: {
    className: 'h-96',
    dotSize: 15,
    dotColor: 'var(--surface-hover)',
    fadeIntensity: 40,
    children: (
      <div className="flex h-full items-center justify-center p-8">
        <div className="max-w-2xl text-center">
          <h2 className="mb-4 text-3xl font-semibold">Subtle Background</h2>
          <p className="text-muted-foreground">
            Perfect for sections that need a subtle texture without overwhelming the content. The
            dots provide visual interest while maintaining readability.
          </p>
        </div>
      </div>
    ),
  },
};

export const AccentDots: Story = {
  args: {
    className: 'h-96',
    dotSize: 25,
    dotColor: 'var(--accent)',
    fadeIntensity: 10,
    children: (
      <div className="flex h-full items-center justify-center">
        <div className="bg-background/80 rounded-lg p-8 backdrop-blur">
          <h2 className="text-accent text-3xl font-bold">Accent Dots</h2>
          <p className="text-muted-foreground mt-2">Using brand colors for a more vibrant look</p>
        </div>
      </div>
    ),
  },
};

export const DenseDots: Story = {
  args: {
    className: 'h-96',
    dotSize: 10,
    fadeIntensity: 50,
    children: (
      <div className="flex h-full items-center justify-center">
        <h2 className="text-3xl font-bold">Dense Dot Pattern</h2>
      </div>
    ),
  },
};

export const NoFade: Story = {
  args: {
    className: 'h-96',
    dotSize: 20,
    fadeIntensity: 0,
    children: (
      <div className="flex h-full items-center justify-center">
        <div className="bg-background/90 rounded-lg p-8">
          <h2 className="text-3xl font-bold">No Fade Effect</h2>
          <p className="text-muted-foreground mt-2">
            Uniform dot pattern across the entire background
          </p>
        </div>
      </div>
    ),
  },
};
