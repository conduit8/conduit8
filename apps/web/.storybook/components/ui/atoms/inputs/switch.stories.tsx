import type { Meta, StoryObj } from '@storybook/react';

import { Label } from '@web/ui/components/atoms/typography/label';
import { useRef } from 'react';

import { Switch } from '@web/ui/components/atoms/inputs/switch';

const meta = {
  title: 'Components/Atoms/Inputs/Switch',
  component: Switch,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    disabled: {
      control: 'boolean',
      description: 'Disable the switch',
    },
    checked: {
      control: 'boolean',
      description: 'Checked state',
    },
    onCheckedChange: {
      action: 'checked changed',
    },
  },
} satisfies Meta<typeof Switch>;

export default meta;
type Story = StoryObj<typeof meta>;

// Wrapper component to properly handle ref
const SwitchWithRef = (props: any) => {
  const ref = useRef(null);
  return <Switch {...props} ref={ref} />;
};

export const Default: Story = {
  render: (args) => <SwitchWithRef {...args} />,
};

export const Checked: Story = {
  render: (args) => <SwitchWithRef {...args} checked />,
};

export const Disabled: Story = {
  render: (args) => <SwitchWithRef {...args} disabled />,
};

export const DisabledChecked: Story = {
  render: (args) => <SwitchWithRef {...args} disabled checked />,
};

export const WithLabel: Story = {
  render: () => {
    const ref = useRef(null);
    return (
      <div className="flex items-center space-x-2">
        <Switch id="airplane-mode" ref={ref} />
        <Label htmlFor="airplane-mode" className="cursor-pointer">
          Airplane Mode
        </Label>
      </div>
    );
  },
};

export const States: Story = {
  render: () => {
    const ref1 = useRef(null);
    const ref2 = useRef(null);
    const ref3 = useRef(null);
    const ref4 = useRef(null);

    return (
      <div className="space-y-4">
        <div className="flex items-center space-x-2">
          <Switch id="unchecked" ref={ref1} />
          <Label htmlFor="unchecked">Unchecked</Label>
        </div>

        <div className="flex items-center space-x-2">
          <Switch id="checked" ref={ref2} defaultChecked />
          <Label htmlFor="checked">Checked</Label>
        </div>

        <div className="flex items-center space-x-2">
          <Switch id="disabled-off" ref={ref3} disabled />
          <Label htmlFor="disabled-off" className="opacity-50">
            Disabled (off)
          </Label>
        </div>

        <div className="flex items-center space-x-2">
          <Switch id="disabled-on" ref={ref4} disabled defaultChecked />
          <Label htmlFor="disabled-on" className="opacity-50">
            Disabled (on)
          </Label>
        </div>
      </div>
    );
  },
};

export const SettingsExample: Story = {
  render: () => {
    const ref1 = useRef(null);
    const ref2 = useRef(null);
    const ref3 = useRef(null);
    const ref4 = useRef(null);

    return (
      <div className="bg-surface w-96 space-y-6 rounded-lg border p-6">
        <h5>Notification Settings</h5>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="marketing">Marketing emails</Label>
              <p className="text-muted-foreground text-sm">
                Receive emails about new products and features
              </p>
            </div>
            <Switch id="marketing" ref={ref1} defaultChecked />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="security">Security alerts</Label>
              <p className="text-muted-foreground text-sm">Get notified about account security</p>
            </div>
            <Switch id="security" ref={ref2} defaultChecked />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="updates">Product updates</Label>
              <p className="text-muted-foreground text-sm">Stay informed about app improvements</p>
            </div>
            <Switch id="updates" ref={ref3} />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="newsletter">Newsletter</Label>
              <p className="text-muted-foreground text-sm">Weekly digest of interesting content</p>
            </div>
            <Switch id="newsletter" ref={ref4} />
          </div>
        </div>
      </div>
    );
  },
};

export const FormExample: Story = {
  render: () => {
    const ref1 = useRef(null);
    const ref2 = useRef(null);
    const ref3 = useRef(null);

    return (
      <div className="bg-surface w-96 space-y-6 rounded-lg border p-6">
        <h5>Privacy Settings</h5>

        <div className="space-y-4">
          <div className="flex items-start justify-between gap-3">
            <div className="space-y-0.5">
              <Label htmlFor="public-profile" className="font-medium">
                Public Profile
              </Label>
              <p className="text-muted-foreground text-sm">Make your profile visible to everyone</p>
            </div>
            <Switch id="public-profile" ref={ref1} />
          </div>

          <div className="flex items-start justify-between gap-3">
            <div className="space-y-0.5">
              <Label htmlFor="show-email" className="font-medium">
                Show Email
              </Label>
              <p className="text-muted-foreground text-sm">
                Display your email on your public profile
              </p>
            </div>
            <Switch id="show-email" ref={ref2} />
          </div>

          <div className="flex items-start justify-between gap-3">
            <div className="space-y-0.5">
              <Label htmlFor="analytics" className="font-medium">
                Analytics
              </Label>
              <p className="text-muted-foreground text-sm">Help us improve by sharing usage data</p>
            </div>
            <Switch id="analytics" ref={ref3} defaultChecked />
          </div>
        </div>
      </div>
    );
  },
};

export const ColorVariants: Story = {
  render: () => {
    const ref1 = useRef(null);
    const ref2 = useRef(null);
    const ref3 = useRef(null);
    const ref4 = useRef(null);

    return (
      <div className="space-y-4">
        <div className="flex items-center space-x-2">
          <Switch
            id="accent"
            ref={ref1}
            defaultChecked
            className="data-[state=checked]:bg-accent"
          />
          <Label htmlFor="accent">Accent color (default)</Label>
        </div>

        <div className="flex items-center space-x-2">
          <Switch
            id="primary"
            ref={ref2}
            defaultChecked
            className="data-[state=checked]:bg-primary"
          />
          <Label htmlFor="primary">Primary color</Label>
        </div>

        <div className="flex items-center space-x-2">
          <Switch
            id="success"
            ref={ref3}
            defaultChecked
            className="data-[state=checked]:bg-success"
          />
          <Label htmlFor="success">Success state</Label>
        </div>

        <div className="flex items-center space-x-2">
          <Switch
            id="destructive"
            ref={ref4}
            defaultChecked
            className="data-[state=checked]:bg-destructive"
          />
          <Label htmlFor="destructive">Destructive state</Label>
        </div>
      </div>
    );
  },
};

export const SizeVariants: Story = {
  render: () => {
    const ref1 = useRef(null);
    const ref2 = useRef(null);
    const ref3 = useRef(null);

    return (
      <div className="space-y-4">
        <div className="flex items-center space-x-2">
          <Switch
            id="small"
            ref={ref1}
            defaultChecked
            className="h-4 w-8 [&>span]:h-3 [&>span]:w-3 [&>span]:data-[state=checked]:translate-x-4"
          />
          <Label htmlFor="small">Small size</Label>
        </div>

        <div className="flex items-center space-x-2">
          <Switch id="medium" ref={ref2} defaultChecked />
          <Label htmlFor="medium">Default size</Label>
        </div>

        <div className="flex items-center space-x-2">
          <Switch
            id="large"
            ref={ref3}
            defaultChecked
            className="h-8 w-14 [&>span]:h-7 [&>span]:w-7 [&>span]:data-[state=checked]:translate-x-6"
          />
          <Label htmlFor="large">Large size</Label>
        </div>
      </div>
    );
  },
};
