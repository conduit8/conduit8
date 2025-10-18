import type { Meta, StoryObj } from '@storybook/react-vite';

import { Button } from '@web/components/ui/atoms';
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@web/components/ui/layout/containers/card.tsx';
import { MoreVertical } from 'lucide-react';

const meta: Meta<typeof Card> = {
  title: 'Components/Layout/Card',
  component: Card,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
};

export default meta;
type Story = StoryObj<typeof Card>;

/**
 * A basic card with all components: header, content, and footer.
 */
export const Default: Story = {
  render: () => (
    <Card className="w-[350px]">
      <CardHeader>
        <CardTitle>Card Title</CardTitle>
        <CardDescription>Card description with supporting text</CardDescription>
      </CardHeader>
      <CardContent>
        <p>This is the main content area of the card. It can contain any content you need.</p>
      </CardContent>
      <CardFooter className>
        <Button variant="default">Action</Button>
        <Button variant="outline">Cancel</Button>
      </CardFooter>
    </Card>
  ),
};

/**
 * A simple card with just header and content.
 */
export const Simple: Story = {
  render: () => (
    <Card className="w-[350px]">
      <CardHeader>
        <CardTitle>Simple Card</CardTitle>
      </CardHeader>
      <CardContent>
        <p>A simpler card with minimal components.</p>
      </CardContent>
    </Card>
  ),
};

/**
 * A card with an action button in the header.
 */
export const WithAction: Story = {
  render: () => (
    <Card className="w-[350px]">
      <CardHeader>
        <CardTitle>Card with Action</CardTitle>
        <CardDescription>This card has an action button in the header</CardDescription>
        <CardAction>
          <Button variant="ghost" size="icon">
            <MoreVertical className="h-4 w-4" />
          </Button>
        </CardAction>
      </CardHeader>
      <CardContent>
        <p>The action button is positioned in the top-right corner of the card header.</p>
      </CardContent>
    </Card>
  ),
};
