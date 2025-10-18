import type { Meta, StoryObj } from '@storybook/react-vite';

import { Button } from '@web/components/ui/atoms/buttons/button';
import { Checkbox } from '@web/components/ui/atoms/inputs/checkbox';
import { Input } from '@web/components/ui/atoms/inputs/input';
import { Switch } from '@web/components/ui/atoms/inputs/switch';
import { Textarea } from '@web/components/ui/atoms/inputs/textarea';
import React from 'react';

const meta: Meta = {
  title: 'Design System/Components Overview',
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'Complete component library with variants, states, and usage guidelines',
      },
    },
  },
};

export default meta;
type Story = StoryObj;

// Enhanced component section with proper styling
const ComponentSection = ({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
}) => {
  return (
    <section className="space-y-4">
      <div className="space-y-2">
        <h2 className="text-foreground text-xl font-bold">{title}</h2>
        {description && <p className="text-muted-foreground text-sm">{description}</p>}
      </div>
      <div className="space-y-4">{children}</div>
    </section>
  );
};

// Component showcase with code examples
const ComponentShowcase = ({
  title,
  description,
  children,
  codeExample,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
  codeExample?: string;
}) => {
  return (
    <div className="space-y-3">
      <div className="space-y-1">
        <h3 className="text-foreground text-sm font-medium">{title}</h3>
        {description && <p className="text-muted-foreground text-xs">{description}</p>}
      </div>

      {/* Visual component demo */}
      <div className="bg-card rounded-lg border p-4">{children}</div>

      {/* Code example */}
      {codeExample && (
        <div className="bg-muted text-muted-foreground rounded p-3 font-mono text-xs">
          {codeExample}
        </div>
      )}
    </div>
  );
};

export const FormControls: Story = {
  render: () => {
    return (
      <div className="mx-auto max-w-7xl space-y-12 p-8">
        <div className="space-y-4">
          <h1 className="text-foreground text-3xl font-bold">Form Controls</h1>
          <p className="text-muted-foreground">
            Input components with consistent styling and interaction patterns
          </p>
        </div>

        <ComponentSection
          title="Text Inputs"
          description="Primary text input with proper focus and error states"
        >
          <ComponentShowcase
            title="Input States"
            description="Normal, focused, disabled, and error states"
            codeExample='<Input placeholder="Enter text..." />'
          >
            <div className="grid max-w-2xl grid-cols-1 gap-6 md:grid-cols-2">
              <div className="space-y-3">
                <div>
                  <label className="text-foreground mb-2 block text-sm font-medium">
                    Default Input
                  </label>
                  <Input placeholder="Type something..." />
                </div>
                <div>
                  <label className="text-foreground mb-2 block text-sm font-medium">
                    With Value
                  </label>
                  <Input defaultValue="Sample content" />
                </div>
              </div>
              <div className="space-y-3">
                <div>
                  <label className="text-muted-foreground mb-2 block text-sm font-medium">
                    Disabled Input
                  </label>
                  <Input placeholder="Disabled state" disabled />
                </div>
                <div>
                  <label className="text-foreground mb-2 block text-sm font-medium">Textarea</label>
                  <Textarea placeholder="Multiple lines..." rows={3} />
                </div>
              </div>
            </div>
          </ComponentShowcase>
        </ComponentSection>

        <ComponentSection
          title="Selection Controls"
          description="Checkbox and switch components for boolean inputs"
        >
          <ComponentShowcase
            title="Boolean Inputs"
            description="Checkbox for multi-select, switch for toggle states"
            codeExample='<Checkbox id="terms" />'
          >
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
              <div className="space-y-4">
                <h4 className="text-foreground text-sm font-medium">Checkboxes</h4>
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <Checkbox id="terms1" />
                    <label htmlFor="terms1" className="text-foreground text-sm">
                      Accept terms and conditions
                    </label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="newsletter1" defaultChecked />
                    <label htmlFor="newsletter1" className="text-foreground text-sm">
                      Subscribe to newsletter
                    </label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="disabled1" disabled />
                    <label htmlFor="disabled1" className="text-muted-foreground text-sm">
                      Disabled option
                    </label>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="text-foreground text-sm font-medium">Switches</h4>
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <Switch id="notifications" />
                    <label htmlFor="notifications" className="text-foreground text-sm">
                      Enable notifications
                    </label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch id="dark-mode" defaultChecked />
                    <label htmlFor="dark-mode" className="text-foreground text-sm">
                      Dark mode
                    </label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch id="disabled-switch" disabled />
                    <label htmlFor="disabled-switch" className="text-muted-foreground text-sm">
                      Disabled toggle
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </ComponentShowcase>
        </ComponentSection>

        {/* Form Layout Example */}
        <ComponentSection
          title="Form Layout Example"
          description="Complete form demonstrating component usage together"
        >
          <ComponentShowcase
            title="Contact Form"
            description="Real-world form layout with proper spacing and labels"
          >
            <div className="max-w-md space-y-4">
              <div className="space-y-2">
                <label className="text-foreground text-sm font-medium">Name</label>
                <Input placeholder="Your full name" />
              </div>
              <div className="space-y-2">
                <label className="text-foreground text-sm font-medium">Email</label>
                <Input type="email" placeholder="your@email.com" />
              </div>
              <div className="space-y-2">
                <label className="text-foreground text-sm font-medium">Message</label>
                <Textarea placeholder="Your message..." rows={4} />
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="contact-terms" />
                <label htmlFor="contact-terms" className="text-foreground text-sm">
                  I agree to the terms of service
                </label>
              </div>
              <div className="flex gap-3 pt-2">
                <Button variant="default">Send Message</Button>
                <Button variant="outline">Cancel</Button>
              </div>
            </div>
          </ComponentShowcase>
        </ComponentSection>
      </div>
    );
  },
};

export const DesignTokens: Story = {
  render: () => {
    const radiusTokens = [
      { name: 'None', value: '0px', variable: '0' },
      { name: 'Small', value: '0.25rem', variable: 'var(--radius)' },
      { name: 'Default', value: '0.5rem', variable: 'var(--radius)' },
      { name: 'Large', value: '0.75rem', variable: 'var(--radius)' },
    ];

    return (
      <div className="mx-auto max-w-7xl space-y-12 p-8">
        <div className="space-y-4">
          <h1 className="text-foreground text-3xl font-bold">Design Tokens</h1>
          <p className="text-muted-foreground">
            Foundational design tokens that power consistent styling across components
          </p>
        </div>

        <ComponentSection
          title="Border Radius"
          description="Consistent corner rounding using CSS custom properties"
        >
          <ComponentShowcase
            title="Radius Scale"
            description="Components use var(--radius) with optional modifiers"
            codeExample="border-radius: var(--radius);"
          >
            <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
              {radiusTokens.map((token, index) => (
                <div key={token.name} className="space-y-3 text-center">
                  <div
                    className="bg-primary mx-auto h-20 w-20"
                    style={{ borderRadius: index === 0 ? '0' : 'var(--radius)' }}
                  />
                  <div className="space-y-1">
                    <div className="text-foreground text-sm font-medium">{token.name}</div>
                    <div className="text-muted-foreground font-mono text-xs">{token.value}</div>
                  </div>
                </div>
              ))}
            </div>
          </ComponentShowcase>
        </ComponentSection>

        <ComponentSection
          title="Shadow System"
          description="Elevation shadows for depth and hierarchy"
        >
          <ComponentShowcase
            title="Shadow Levels"
            description="From subtle to prominent elevation effects"
          >
            <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
              <div className="space-y-3 text-center">
                <div className="bg-card mx-auto h-20 w-20 rounded border" />
                <div className="text-sm font-medium">None</div>
                <div className="text-muted-foreground text-xs">border only</div>
              </div>
              <div className="space-y-3 text-center">
                <div className="bg-card mx-auto h-20 w-20 rounded shadow-sm" />
                <div className="text-sm font-medium">Small</div>
                <div className="text-muted-foreground text-xs">shadow-sm</div>
              </div>
              <div className="space-y-3 text-center">
                <div className="bg-card mx-auto h-20 w-20 rounded shadow" />
                <div className="text-sm font-medium">Default</div>
                <div className="text-muted-foreground text-xs">shadow</div>
              </div>
              <div className="space-y-3 text-center">
                <div className="bg-card mx-auto h-20 w-20 rounded shadow-lg" />
                <div className="text-sm font-medium">Large</div>
                <div className="text-muted-foreground text-xs">shadow-lg</div>
              </div>
            </div>
          </ComponentShowcase>
        </ComponentSection>
      </div>
    );
  },
};
