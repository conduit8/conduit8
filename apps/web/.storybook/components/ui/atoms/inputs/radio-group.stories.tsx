import type { Meta, StoryObj } from '@storybook/react';

import { Label } from '@web/ui/components/atoms/typography/label';

import { RadioGroup, RadioGroupItem } from '@web/ui/components/atoms/inputs/radio-group';

const meta = {
  title: 'Components/Atoms/Inputs/RadioGroup',
  component: RadioGroup,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    disabled: {
      control: 'boolean',
      description: 'Disable all radio items',
    },
    value: {
      control: 'text',
      description: 'Selected value',
    },
    onValueChange: {
      action: 'value changed',
    },
  },
} satisfies Meta<typeof RadioGroup>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => (
    <RadioGroup {...args}>
      <div className="flex items-center space-x-2">
        <RadioGroupItem value="option1" id="option1" />
        <Label htmlFor="option1" className="cursor-pointer">
          Option 1
        </Label>
      </div>
      <div className="flex items-center space-x-2">
        <RadioGroupItem value="option2" id="option2" />
        <Label htmlFor="option2" className="cursor-pointer">
          Option 2
        </Label>
      </div>
      <div className="flex items-center space-x-2">
        <RadioGroupItem value="option3" id="option3" />
        <Label htmlFor="option3" className="cursor-pointer">
          Option 3
        </Label>
      </div>
    </RadioGroup>
  ),
};

export const WithDefaultValue: Story = {
  args: {
    defaultValue: 'comfortable',
  },
  render: (args) => (
    <RadioGroup {...args}>
      <div className="flex items-center space-x-2">
        <RadioGroupItem value="default" id="r1" />
        <Label htmlFor="r1" className="cursor-pointer">
          Default
        </Label>
      </div>
      <div className="flex items-center space-x-2">
        <RadioGroupItem value="comfortable" id="r2" />
        <Label htmlFor="r2" className="cursor-pointer">
          Comfortable (selected)
        </Label>
      </div>
      <div className="flex items-center space-x-2">
        <RadioGroupItem value="compact" id="r3" />
        <Label htmlFor="r3" className="cursor-pointer">
          Compact
        </Label>
      </div>
    </RadioGroup>
  ),
};

export const Disabled: Story = {
  args: {
    disabled: true,
    defaultValue: 'option2',
  },
  render: (args) => (
    <RadioGroup {...args}>
      <div className="flex items-center space-x-2">
        <RadioGroupItem value="option1" id="d1" />
        <Label htmlFor="d1" className="cursor-pointer opacity-50">
          Option 1
        </Label>
      </div>
      <div className="flex items-center space-x-2">
        <RadioGroupItem value="option2" id="d2" />
        <Label htmlFor="d2" className="cursor-pointer opacity-50">
          Option 2 (selected)
        </Label>
      </div>
      <div className="flex items-center space-x-2">
        <RadioGroupItem value="option3" id="d3" />
        <Label htmlFor="d3" className="cursor-pointer opacity-50">
          Option 3
        </Label>
      </div>
    </RadioGroup>
  ),
};

export const ModelSelectionExample: Story = {
  render: () => (
    <div className="bg-surface w-96 space-y-4 rounded-lg border p-6">
      <h5>Select Model</h5>

      <RadioGroup defaultValue="whisper-large-v3">
        <div className="flex gap-2">
          <RadioGroupItem value="whisper-large-v3" id="model-v3" />
          <div className="flex-1">
            <Label htmlFor="model-v3" className="cursor-pointer">
              <span className="flex items-center gap-2">
                <span>🎯</span>
                <span className="font-medium">v3 Accurate</span>
              </span>
            </Label>
            <p className="text-muted-foreground mt-1 text-sm">Highest transcription quality</p>
            <p className="text-muted-foreground text-sm">Blazing fast processing</p>
          </div>
        </div>

        <div className="flex gap-2">
          <RadioGroupItem value="whisper-large-v3-turbo" id="model-v3-turbo" />
          <div className="flex-1">
            <Label htmlFor="model-v3-turbo" className="cursor-pointer">
              <span className="flex items-center gap-2">
                <span>⚡</span>
                <span className="font-medium">v3 Lightning</span>
              </span>
            </Label>
            <p className="text-muted-foreground mt-1 text-sm">Fastest processing speed</p>
            <p className="text-muted-foreground text-sm">Great accuracy</p>
          </div>
        </div>
      </RadioGroup>
    </div>
  ),
};

export const PaymentMethodExample: Story = {
  render: () => (
    <div className="bg-surface w-96 space-y-4 rounded-lg border p-6">
      <h5>Payment Method</h5>

      <RadioGroup defaultValue="card">
        <div className="space-y-3">
          <div className="flex items-start space-x-3">
            <RadioGroupItem value="card" id="payment-card" className="mt-0.5" />
            <div className="flex-1">
              <Label htmlFor="payment-card" className="cursor-pointer">
                Credit or Debit Card
              </Label>
              <p className="text-muted-foreground mt-1 text-sm">
                Visa, Mastercard, American Express
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-3">
            <RadioGroupItem value="paypal" id="payment-paypal" className="mt-0.5" />
            <div className="flex-1">
              <Label htmlFor="payment-paypal" className="cursor-pointer">
                PayPal
              </Label>
              <p className="text-muted-foreground mt-1 text-sm">Fast and secure payment</p>
            </div>
          </div>

          <div className="flex items-start space-x-3">
            <RadioGroupItem value="bank" id="payment-bank" className="mt-0.5" />
            <div className="flex-1">
              <Label htmlFor="payment-bank" className="cursor-pointer">
                Bank Transfer
              </Label>
              <p className="text-muted-foreground mt-1 text-sm">Direct bank to bank transfer</p>
            </div>
          </div>
        </div>
      </RadioGroup>
    </div>
  ),
};

export const OrientationVariants: Story = {
  render: () => (
    <div className="space-y-6">
      <div>
        <h6 className="mb-3">Vertical (Default)</h6>
        <RadioGroup defaultValue="option1">
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="option1" id="v1" />
            <Label htmlFor="v1">Option 1</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="option2" id="v2" />
            <Label htmlFor="v2">Option 2</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="option3" id="v3" />
            <Label htmlFor="v3">Option 3</Label>
          </div>
        </RadioGroup>
      </div>

      <div>
        <h6 className="mb-3">Horizontal</h6>
        <RadioGroup defaultValue="option1" className="flex flex-row gap-6">
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="option1" id="h1" />
            <Label htmlFor="h1">Option 1</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="option2" id="h2" />
            <Label htmlFor="h2">Option 2</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="option3" id="h3" />
            <Label htmlFor="h3">Option 3</Label>
          </div>
        </RadioGroup>
      </div>
    </div>
  ),
};

export const ColorStates: Story = {
  render: () => (
    <div className="space-y-4">
      <div>
        <Label className="mb-2">Primary (Default)</Label>
        <RadioGroup defaultValue="primary">
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="primary" id="c1" />
            <Label htmlFor="c1">Selected with primary color</Label>
          </div>
        </RadioGroup>
      </div>

      <div>
        <Label className="mb-2">With Focus Ring</Label>
        <RadioGroup>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="focus" id="c2" className="focus-visible:ring-4" />
            <Label htmlFor="c2">Tab to see focus ring</Label>
          </div>
        </RadioGroup>
      </div>

      <div>
        <Label className="mb-2">Error State</Label>
        <RadioGroup>
          <div className="flex items-center space-x-2">
            <RadioGroupItem
              value="error"
              id="c3"
              className="aria-invalid:border-destructive"
              aria-invalid="true"
            />
            <Label htmlFor="c3" className="text-destructive">
              Invalid selection
            </Label>
          </div>
        </RadioGroup>
      </div>
    </div>
  ),
};
