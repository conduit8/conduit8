import type { Meta, StoryObj } from '@storybook/react-vite';

const meta: Meta = {
  title: 'Design System/Shadows',
  parameters: {
    layout: 'padded',
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const TailwindDefaults: Story = {
  render: () => (
    <div className="mx-auto max-w-7xl space-y-8 p-8">
      <div>
        <h2 className="mb-4 text-2xl font-bold">Tailwind Default Shadows</h2>
        <p className="text-muted-foreground mb-6">
          Standard Tailwind shadow utilities with soft, blurred edges
        </p>
      </div>

      <div className="grid grid-cols-2 gap-12 md:grid-cols-3 lg:grid-cols-4">
        <div className="space-y-3">
          <div className="bg-card border-border flex h-32 w-32 items-center justify-center rounded-lg border">
            <span className="text-sm">None</span>
          </div>
          <div className="text-center">
            <div className="text-sm font-medium">No Shadow</div>
            <div className="text-muted-foreground text-sm">shadow-none</div>
          </div>
        </div>

        <div className="space-y-3">
          <div className="bg-card border-border flex h-32 w-32 items-center justify-center rounded-lg border shadow-sm">
            <span className="text-sm">Small</span>
          </div>
          <div className="text-center">
            <div className="text-sm font-medium">Small</div>
            <div className="text-muted-foreground text-sm">shadow-sm</div>
          </div>
        </div>

        <div className="space-y-3">
          <div className="bg-card border-border flex h-32 w-32 items-center justify-center rounded-lg border shadow">
            <span className="text-sm">Default</span>
          </div>
          <div className="text-center">
            <div className="text-sm font-medium">Default</div>
            <div className="text-muted-foreground text-sm">shadow</div>
          </div>
        </div>

        <div className="space-y-3">
          <div className="bg-card border-border flex h-32 w-32 items-center justify-center rounded-lg border shadow-md">
            <span className="text-sm">Medium</span>
          </div>
          <div className="text-center">
            <div className="text-sm font-medium">Medium</div>
            <div className="text-muted-foreground text-sm">shadow-md</div>
          </div>
        </div>

        <div className="space-y-3">
          <div className="bg-card border-border flex h-32 w-32 items-center justify-center rounded-lg border shadow-lg">
            <span className="text-sm">Large</span>
          </div>
          <div className="text-center">
            <div className="text-sm font-medium">Large</div>
            <div className="text-muted-foreground text-sm">shadow-lg</div>
          </div>
        </div>

        <div className="space-y-3">
          <div className="bg-card border-border flex h-32 w-32 items-center justify-center rounded-lg border shadow-xl">
            <span className="text-sm">XL</span>
          </div>
          <div className="text-center">
            <div className="text-sm font-medium">Extra Large</div>
            <div className="text-muted-foreground text-sm">shadow-xl</div>
          </div>
        </div>

        <div className="space-y-3">
          <div className="bg-card border-border flex h-32 w-32 items-center justify-center rounded-lg border shadow-2xl">
            <span className="text-sm">2XL</span>
          </div>
          <div className="text-center">
            <div className="text-sm font-medium">2X Large</div>
            <div className="text-muted-foreground text-sm">shadow-2xl</div>
          </div>
        </div>
      </div>
    </div>
  ),
};

export const CustomHardShadows: Story = {
  render: () => (
    <div className="space-y-8">
      <div>
        <h2 className="mb-4 text-2xl font-bold">Custom Hard Shadows</h2>
        <p className="text-muted-foreground mb-6">Isometric/cartoon style shadows with no blur</p>
      </div>

      <div className="grid grid-cols-2 gap-8 md:grid-cols-3">
        <div className="space-y-3">
          <div className="bg-card border-foreground shadow-hard-sm flex h-32 w-32 items-center justify-center rounded-lg border-2">
            <span className="text-sm">Small</span>
          </div>
          <div className="text-center">
            <div className="text-sm font-medium">Hard Small</div>
            <div className="text-muted-foreground text-sm">shadow-hard-sm</div>
          </div>
        </div>

        <div className="space-y-3">
          <div className="bg-card border-foreground shadow-hard flex h-32 w-32 items-center justify-center rounded-lg border-2">
            <span className="text-sm">Default</span>
          </div>
          <div className="text-center">
            <div className="text-sm font-medium">Hard Default</div>
            <div className="text-muted-foreground text-sm">shadow-hard</div>
          </div>
        </div>

        <div className="space-y-3">
          <div className="bg-card border-foreground shadow-hard-lg flex h-32 w-32 items-center justify-center rounded-lg border-2">
            <span className="text-sm">Large</span>
          </div>
          <div className="text-center">
            <div className="text-sm font-medium">Hard Large</div>
            <div className="text-muted-foreground text-sm">shadow-hard-lg</div>
          </div>
        </div>

        <div className="space-y-3">
          <div className="bg-card shadow-hard-black flex h-32 w-32 items-center justify-center rounded-lg border-2 border-black">
            <span className="text-sm">Black</span>
          </div>
          <div className="text-center">
            <div className="text-sm font-medium">Hard Black</div>
            <div className="text-muted-foreground text-sm">shadow-hard-black</div>
          </div>
        </div>

        <div className="space-y-3">
          <div className="bg-card border-primary shadow-hard-primary flex h-32 w-32 items-center justify-center rounded-lg border-2">
            <span className="text-sm">Primary</span>
          </div>
          <div className="text-center">
            <div className="text-sm font-medium">Hard Primary</div>
            <div className="text-muted-foreground text-sm">shadow-hard-primary</div>
          </div>
        </div>

        <div className="space-y-3">
          <div className="bg-card border-accent shadow-hard-accent flex h-32 w-32 items-center justify-center rounded-lg border-2">
            <span className="text-sm">Accent</span>
          </div>
          <div className="text-center">
            <div className="text-sm font-medium">Hard Accent</div>
            <div className="text-muted-foreground text-sm">shadow-hard-accent</div>
          </div>
        </div>
      </div>
    </div>
  ),
};

export const PricingCardComparison: Story = {
  render: () => (
    <div className="space-y-8">
      <div>
        <h2 className="mb-4 text-2xl font-bold">Pricing Card Shadow Examples</h2>
        <p className="text-muted-foreground mb-6">
          Different shadow styles applied to card components
        </p>
      </div>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
        {/* No Shadow */}
        <div className="bg-card border-border rounded-lg border p-6">
          <h3 className="mb-2 text-lg font-semibold">No Shadow</h3>
          <p className="text-muted-foreground mb-4 text-sm">Clean, minimal look</p>
          <div className="space-y-2">
            <div className="bg-muted h-2 rounded"></div>
            <div className="bg-muted h-2 w-3/4 rounded"></div>
            <div className="bg-muted h-2 w-1/2 rounded"></div>
          </div>
        </div>

        {/* Shadow-sm */}
        <div className="bg-card border-border rounded-lg border p-6 shadow-sm">
          <h3 className="mb-2 text-lg font-semibold">shadow-sm</h3>
          <p className="text-muted-foreground mb-4 text-sm">Subtle elevation</p>
          <div className="space-y-2">
            <div className="bg-muted h-2 rounded"></div>
            <div className="bg-muted h-2 w-3/4 rounded"></div>
            <div className="bg-muted h-2 w-1/2 rounded"></div>
          </div>
        </div>

        {/* Shadow-md */}
        <div className="bg-card border-border rounded-lg border p-6 shadow-md">
          <h3 className="mb-2 text-lg font-semibold">shadow-md</h3>
          <p className="text-muted-foreground mb-4 text-sm">Moderate depth</p>
          <div className="space-y-2">
            <div className="bg-muted h-2 rounded"></div>
            <div className="bg-muted h-2 w-3/4 rounded"></div>
            <div className="bg-muted h-2 w-1/2 rounded"></div>
          </div>
        </div>

        {/* Shadow-lg (current non-premium) */}
        <div className="bg-card border-border rounded-lg border p-6 shadow-lg">
          <h3 className="mb-2 text-lg font-semibold">shadow-lg (Current)</h3>
          <p className="text-muted-foreground mb-4 text-sm">Your current non-premium card</p>
          <div className="space-y-2">
            <div className="bg-muted h-2 rounded"></div>
            <div className="bg-muted h-2 w-3/4 rounded"></div>
            <div className="bg-muted h-2 w-1/2 rounded"></div>
          </div>
        </div>

        {/* Shadow-xl */}
        <div className="bg-card border-border rounded-lg border p-6 shadow-xl">
          <h3 className="mb-2 text-lg font-semibold">shadow-xl</h3>
          <p className="text-muted-foreground mb-4 text-sm">Strong elevation</p>
          <div className="space-y-2">
            <div className="bg-muted h-2 rounded"></div>
            <div className="bg-muted h-2 w-3/4 rounded"></div>
            <div className="bg-muted h-2 w-1/2 rounded"></div>
          </div>
        </div>

        {/* Shadow-2xl */}
        <div className="bg-card border-border rounded-lg border p-6 shadow-2xl">
          <h3 className="mb-2 text-lg font-semibold">shadow-2xl</h3>
          <p className="text-muted-foreground mb-4 text-sm">Maximum depth</p>
          <div className="space-y-2">
            <div className="bg-muted h-2 rounded"></div>
            <div className="bg-muted h-2 w-3/4 rounded"></div>
            <div className="bg-muted h-2 w-1/2 rounded"></div>
          </div>
        </div>
      </div>
    </div>
  ),
};

export const OnColoredBackgrounds: Story = {
  render: () => (
    <div className="space-y-8">
      <div>
        <h2 className="mb-4 text-2xl font-bold">Shadows on Different Backgrounds</h2>
        <p className="text-muted-foreground mb-6">
          How shadows appear on various background colors
        </p>
      </div>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
        {/* Light Background */}
        <div className="rounded-lg bg-gray-100 p-8 dark:bg-gray-900">
          <h3 className="mb-4 text-lg font-semibold">Light Background</h3>
          <div className="space-y-4">
            <div className="rounded-lg bg-white p-4 shadow-sm dark:bg-gray-800">shadow-sm</div>
            <div className="rounded-lg bg-white p-4 shadow-md dark:bg-gray-800">shadow-md</div>
            <div className="rounded-lg bg-white p-4 shadow-lg dark:bg-gray-800">shadow-lg</div>
          </div>
        </div>

        {/* Dark Background */}
        <div className="rounded-lg bg-gray-800 p-8">
          <h3 className="mb-4 text-lg font-semibold text-white">Dark Background</h3>
          <div className="space-y-4">
            <div className="rounded-lg bg-gray-700 p-4 text-white shadow-sm">shadow-sm</div>
            <div className="rounded-lg bg-gray-700 p-4 text-white shadow-md">shadow-md</div>
            <div className="rounded-lg bg-gray-700 p-4 text-white shadow-lg">shadow-lg</div>
          </div>
        </div>

        {/* Colored Background */}
        <div className="rounded-lg bg-blue-100 p-8 dark:bg-blue-900">
          <h3 className="mb-4 text-lg font-semibold">Colored Background</h3>
          <div className="space-y-4">
            <div className="rounded-lg bg-white p-4 shadow-sm dark:bg-gray-800">shadow-sm</div>
            <div className="rounded-lg bg-white p-4 shadow-md dark:bg-gray-800">shadow-md</div>
            <div className="rounded-lg bg-white p-4 shadow-lg dark:bg-gray-800">shadow-lg</div>
          </div>
        </div>

        {/* Gradient Background */}
        <div className="rounded-lg bg-gradient-to-br from-purple-100 to-pink-100 p-8 dark:from-purple-900 dark:to-pink-900">
          <h3 className="mb-4 text-lg font-semibold">Gradient Background</h3>
          <div className="space-y-4">
            <div className="rounded-lg bg-white p-4 shadow-sm dark:bg-gray-800">shadow-sm</div>
            <div className="rounded-lg bg-white p-4 shadow-md dark:bg-gray-800">shadow-md</div>
            <div className="rounded-lg bg-white p-4 shadow-lg dark:bg-gray-800">shadow-lg</div>
          </div>
        </div>
      </div>
    </div>
  ),
};
