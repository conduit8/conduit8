import type { Meta, StoryObj } from '@storybook/react-vite';

import { LoadingSpinner } from '@web/components/ui/feedback/progress/loading-spinner.tsx';

const meta: Meta<typeof LoadingSpinner> = {
  title: 'Components/Feedback/LoadingSpinner',
  component: LoadingSpinner,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
      description: 'Size of the loading spinner',
    },
    text: {
      control: 'text',
      description: 'Text to display below the spinner',
    },
    className: {
      control: 'text',
      description: 'Additional CSS classes',
    },
  },
};

export default meta;
type Story = StoryObj<typeof LoadingSpinner>;

export const Default: Story = {
  args: {
    size: 'md',
    text: 'Loading...',
  },
};

export const Small: Story = {
  args: {
    size: 'sm',
    text: 'Loading...',
  },
};

export const Large: Story = {
  args: {
    size: 'lg',
    text: 'Loading...',
  },
};

export const NoText: Story = {
  args: {
    size: 'md',
    text: undefined,
  },
};

export const CustomText: Story = {
  args: {
    size: 'md',
    text: 'Please wait while we load your data...',
  },
};

export const CustomClass: Story = {
  args: {
    size: 'md',
    text: 'Loading...',
    className: 'bg-muted p-6 rounded-lg',
  },
};
