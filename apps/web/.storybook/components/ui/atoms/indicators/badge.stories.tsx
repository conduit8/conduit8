import type { Meta, StoryObj } from '@storybook/react-vite';

import { Badge } from '@web/components/ui/atoms/indicators/badge';

const meta: Meta<typeof Badge> = {
  title: 'Components/Atoms/Indicators/Badge',
  component: Badge,
  parameters: {
    layout: 'centered',
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const AllVariants: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <div>
        <h3 className="mb-2 text-sm font-medium">Badge Variants</h3>
        <div className="flex flex-wrap gap-2">
          <Badge variant="neutral">neutral</Badge>
          <Badge variant="success">success</Badge>
          <Badge variant="warning">warning</Badge>
          <Badge variant="destructive">destructive</Badge>
          <Badge variant="info">info</Badge>
          <Badge variant="outline">outline</Badge>
        </div>
      </div>

      <div>
        <h3 className="mb-2 text-sm font-medium">Transcription Status Examples</h3>
        <div className="flex flex-wrap gap-2">
          <Badge variant="neutral">pending</Badge>
          <Badge variant="info">processing</Badge>
          <Badge variant="info">transcribing</Badge>
          <Badge variant="success">completed</Badge>
          <Badge variant="destructive">failed</Badge>
        </div>
      </div>
    </div>
  ),
};
