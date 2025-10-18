import type { Meta, StoryObj } from '@storybook/react-vite';

import { Button } from '@web/components/ui/atoms';

const meta: Meta<typeof Button> = {
  title: 'Components/Atoms/Buttons',
  component: Button,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Button>;

const variants = [
  'default',
  'destructive',
  'outline',
  'secondary',
  'accent',
  'ghost',
  'link',
] as const;
const sizes = ['sm', 'default', 'lg', 'icon'] as const;

export const AllVariants: Story = {
  render: () => (
    <div className="space-y-12 p-8">
      {/* Background Surface */}
      <div className="space-y-6">
        <h2 className="text-xl font-bold">Background Surface</h2>
        <div className="bg-background rounded-lg border p-6">
          <div className="space-y-4">
            {variants.map((variant) => (
              <div key={variant} className="space-y-2">
                <div className="flex items-center gap-4">
                  <div className="text-muted-foreground w-20 text-sm">{variant}</div>
                  <div className="flex gap-2">
                    {sizes.map((size) => (
                      <Button key={size} variant={variant} size={size}>
                        {size === 'icon' ? '→' : 'Button'}
                      </Button>
                    ))}
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-muted-foreground w-20 text-sm opacity-50">disabled</div>
                  <div className="flex gap-2">
                    {sizes.map((size) => (
                      <Button key={size} variant={variant} size={size} disabled>
                        {size === 'icon' ? '→' : 'Button'}
                      </Button>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Card Surface */}
      <div className="space-y-6">
        <h2 className="text-xl font-bold">Card Surface</h2>
        <div className="bg-card rounded-lg border p-6">
          <div className="space-y-4">
            {variants.map((variant) => (
              <div key={variant} className="space-y-2">
                <div className="flex items-center gap-4">
                  <div className="text-muted-foreground w-20 text-sm">{variant}</div>
                  <div className="flex gap-2">
                    {sizes.map((size) => (
                      <Button key={size} variant={variant} size={size}>
                        {size === 'icon' ? '→' : 'Button'}
                      </Button>
                    ))}
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-muted-foreground w-20 text-sm opacity-50">disabled</div>
                  <div className="flex gap-2">
                    {sizes.map((size) => (
                      <Button key={size} variant={variant} size={size} disabled>
                        {size === 'icon' ? '→' : 'Button'}
                      </Button>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Popover Surface */}
      <div className="space-y-6">
        <h2 className="text-xl font-bold">Popover Surface</h2>
        <div className="bg-popover rounded-lg border p-6 shadow-lg">
          <div className="space-y-4">
            {variants.map((variant) => (
              <div key={variant} className="space-y-2">
                <div className="flex items-center gap-4">
                  <div className="text-muted-foreground w-20 text-sm">{variant}</div>
                  <div className="flex gap-2">
                    {sizes.map((size) => (
                      <Button key={size} variant={variant} size={size}>
                        {size === 'icon' ? '→' : 'Button'}
                      </Button>
                    ))}
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-muted-foreground w-20 text-sm opacity-50">disabled</div>
                  <div className="flex gap-2">
                    {sizes.map((size) => (
                      <Button key={size} variant={variant} size={size} disabled>
                        {size === 'icon' ? '→' : 'Button'}
                      </Button>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Muted Surface */}
      <div className="space-y-6">
        <h2 className="text-xl font-bold">Muted Surface</h2>
        <div className="bg-muted rounded-lg p-6">
          <div className="space-y-4">
            {variants.map((variant) => (
              <div key={variant} className="space-y-2">
                <div className="flex items-center gap-4">
                  <div className="text-muted-foreground w-20 text-sm">{variant}</div>
                  <div className="flex gap-2">
                    {sizes.map((size) => (
                      <Button key={size} variant={variant} size={size}>
                        {size === 'icon' ? '→' : 'Button'}
                      </Button>
                    ))}
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-muted-foreground w-20 text-sm opacity-50">disabled</div>
                  <div className="flex gap-2">
                    {sizes.map((size) => (
                      <Button key={size} variant={variant} size={size} disabled>
                        {size === 'icon' ? '→' : 'Button'}
                      </Button>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  ),
};
