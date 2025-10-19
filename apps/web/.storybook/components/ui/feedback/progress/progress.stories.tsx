import type { Meta, StoryObj } from '@storybook/react';

import { Progress } from '@web/ui/components/feedback/progress/progress';

const meta = {
  title: 'Components/Feedback/Progress',
  component: Progress,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    value: {
      control: { type: 'range', min: 0, max: 100, step: 5 },
      description: 'Progress percentage (0-100)',
    },
    animated: {
      control: 'boolean',
      description: 'Enable pulse animation',
    },
    className: {
      control: 'text',
      description: 'Custom classes for root element',
    },
    indicatorClassName: {
      control: 'text',
      description: 'Custom classes for indicator',
    },
  },
} satisfies Meta<typeof Progress>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    value: 50,
    className: 'w-64',
  },
};

export const Thin: Story = {
  args: {
    value: 70,
    className: 'h-2 w-64',
  },
};

export const Thick: Story = {
  args: {
    value: 30,
    className: 'h-6 w-64',
  },
};

export const Animated: Story = {
  args: {
    value: 60,
    animated: true,
    className: 'w-64',
  },
};

export const ColorStates: Story = {
  render: () => (
    <div className="w-64 space-y-4">
      <div>
        <p className="mb-2 text-sm">Green (0 used)</p>
        <Progress value={0} className="h-2" indicatorClassName="bg-green-500" />
      </div>
      <div>
        <p className="mb-2 text-sm">Yellow (1 used)</p>
        <Progress value={33} className="h-2" indicatorClassName="bg-yellow-500" />
      </div>
      <div>
        <p className="mb-2 text-sm">Orange (2 used)</p>
        <Progress value={66} className="h-2" indicatorClassName="bg-orange-500" />
      </div>
      <div>
        <p className="mb-2 text-sm">Red (3 used - at limit)</p>
        <Progress value={100} className="h-2" indicatorClassName="bg-red-500" />
      </div>
    </div>
  ),
};

export const CustomBackground: Story = {
  render: () => (
    <div className="w-64 space-y-4">
      <div>
        <p className="mb-2 text-sm">Default (bg-muted)</p>
        <Progress value={50} />
      </div>
      <div>
        <p className="mb-2 text-sm">Custom background (bg-gray-200)</p>
        <Progress value={50} className="bg-gray-200" />
      </div>
      <div>
        <p className="mb-2 text-sm">Custom background (bg-gray-100)</p>
        <Progress value={50} className="bg-gray-100" />
      </div>
    </div>
  ),
};

export const Sizes: Story = {
  render: () => (
    <div className="w-64 space-y-4">
      <div>
        <p className="mb-2 text-sm">Extra Small (h-1)</p>
        <Progress value={50} className="h-1" />
      </div>
      <div>
        <p className="mb-2 text-sm">Small (h-2)</p>
        <Progress value={50} className="h-2" />
      </div>
      <div>
        <p className="mb-2 text-sm">Default (h-4)</p>
        <Progress value={50} />
      </div>
      <div>
        <p className="mb-2 text-sm">Large (h-6)</p>
        <Progress value={50} className="h-6" />
      </div>
    </div>
  ),
};
