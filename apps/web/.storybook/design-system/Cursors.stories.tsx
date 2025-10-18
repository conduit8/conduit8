import type { Meta, StoryObj } from '@storybook/react-vite';

import React from 'react';

const meta: Meta = {
  title: 'Design System/Cursors',
  parameters: {
    layout: 'fullscreen',
  },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: () => (
    <div className="bg-background min-h-screen p-8">
      <h1 className="font-heading mb-8 text-4xl font-bold">Cursor System</h1>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
        <div className="space-y-6">
          <h2 className="font-heading mb-4 text-2xl font-bold">Standard Cursors</h2>

          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="w-32 font-medium">Default</div>
              <div className="border-border bg-surface flex h-16 w-64 cursor-default items-center justify-center rounded-md border p-4">
                Hover me
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="w-32 font-medium">Pointer</div>
              <div className="border-border bg-surface flex h-16 w-64 cursor-pointer items-center justify-center rounded-md border p-4">
                Hover me
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="w-32 font-medium">Not Allowed</div>
              <div className="border-border bg-surface flex h-16 w-64 cursor-not-allowed items-center justify-center rounded-md border p-4">
                Hover me
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <h2 className="font-heading mb-4 text-2xl font-bold">Component Cursors</h2>

          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="w-32 font-medium">Button</div>
              <button className="border-border bg-primary text-primary-foreground rounded-md border px-4 py-2">
                Button
              </button>
            </div>

            <div className="flex items-center gap-4">
              <div className="w-32 font-medium">Disabled</div>
              <button
                disabled
                className="border-border bg-primary text-primary-foreground cursor-not-allowed rounded-md border px-4 py-2 opacity-50"
              >
                Disabled Button
              </button>
            </div>

            <div className="flex items-center gap-4">
              <div className="w-32 font-medium">Link</div>
              <a href="#" className="text-primary underline">
                Link Example
              </a>
            </div>

            <div className="flex items-center gap-4">
              <div className="w-32 font-medium">Text Input</div>
              <input
                type="text"
                placeholder="Type here..."
                className="border-border bg-surface rounded-md border px-3 py-1"
              />
            </div>

            <div className="flex items-center gap-4">
              <div className="w-32 font-medium">Disabled Input</div>
              <input
                type="text"
                placeholder="Disabled..."
                disabled
                className="border-border bg-surface cursor-not-allowed rounded-md border px-3 py-1 opacity-50"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="mt-12">
        <h2 className="font-heading mb-4 text-2xl font-bold">Cursor Variables Reference</h2>
        <div className="bg-surface border-border overflow-auto rounded-md border p-4">
          <pre className="font-mono text-sm">
            {`/* Standard cursor variables */
--cursor-default: var(--cursor-button);
--cursor-pointer: var(--cursor-link);
--cursor-not-allowed: var(--cursor-disabled);

/* Component-specific cursor variables */
--cursor-button: default;
--cursor-checkbox: default;
--cursor-disabled: not-allowed;
--cursor-link: pointer;
--cursor-menu-item: default;
--cursor-radio: default;
--cursor-slider-thumb: default;
--cursor-slider-thumb-active: default;
--cursor-switch: default;`}
          </pre>
        </div>
      </div>
    </div>
  ),
};
