import type { Meta, StoryObj } from '@storybook/react-vite';

import { Button } from '@web/components/ui/atoms/buttons';
import { Input } from '@web/components/ui/atoms/inputs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@web/components/ui/atoms/inputs/select';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@web/components/ui/layout/containers/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@web/components/ui/overlays/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@web/components/ui/overlays/dropdown-menu';
import { Popover, PopoverContent, PopoverTrigger } from '@web/components/ui/overlays/popover';

const meta: Meta = {
  title: 'Design System/Colors & Components',
  parameters: {
    layout: 'fullscreen',
  },
};

export default meta;
type Story = StoryObj;

export const ColorsAndComponents: Story = {
  render: () => (
    <div className="space-y-12 p-8">
      <div>
        <h1 className="mb-4 text-3xl font-bold">Conduit8 Color Palette</h1>
        <p className="text-muted-foreground">
          A comprehensive view of all colors in our design system, organized by semantic meaning and
          visual hierarchy.
        </p>
      </div>
      {/* Structural Colors - The Foundation */}
      <section>
        <h2 className="mb-6 text-2xl font-bold">Structural Color Hierarchy</h2>
        <p className="text-muted-foreground mb-4">
          Our layer stack creates visual depth through the slate color scale
        </p>

        {/* Visual Layer Stack Diagram */}
        <div className="bg-background mb-8 rounded-lg border p-8">
          <div className="relative">
            {/* Layer 0: Background */}
            <div className="border-border rounded-lg border-2 border-dashed p-6">
              <div className="mb-2 text-sm font-medium">Layer 0: Background</div>
              <p className="text-muted-foreground mb-4 text-xs">Base canvas (--background)</p>

              {/* Layer 1: Surface */}
              <div className="bg-surface rounded-lg border p-6 shadow-sm">
                <div className="mb-2 text-sm font-medium">Layer 1: Surface</div>
                <p className="text-muted-foreground mb-4 text-xs">Cards, Sidebar (--surface)</p>

                {/* Layer 2: Popover */}
                <div className="bg-popover max-w-xs rounded-md border p-4 shadow-md">
                  <div className="mb-1 text-sm font-medium">Layer 2: Popover</div>
                  <p className="text-muted-foreground text-xs">Dropdowns, Tooltips (--popover)</p>
                </div>

                {/* Interactive States */}
                <div className="mt-4 flex gap-2">
                  <div className="bg-surface-hover rounded border px-3 py-2">
                    <span className="text-xs">Hover (--surface-hover)</span>
                  </div>
                  <div className="bg-surface-active rounded border px-3 py-2">
                    <span className="text-xs">Active (--surface-active)</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Real Components Demonstrating the Layers */}
        <div className="mb-8">
          <h3 className="mb-4 text-lg font-medium">Real Components in Action</h3>
          <div className="flex flex-wrap items-start justify-center gap-4">
            {/* Card - Layer 1: Surface */}
            <Card className="w-64">
              <CardHeader>
                <CardTitle className="text-sm">Card Component</CardTitle>
                <CardDescription>Layer 1: Surface</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-xs">
                  Cards elevate content using the surface layer
                </p>
              </CardContent>
            </Card>

            {/* Dialog - Returns to Background */}
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                  Open Dialog (Layer 0)
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-sm">
                <DialogHeader>
                  <DialogTitle className="text-sm">Dialog</DialogTitle>
                  <DialogDescription>Uses background layer with overlay</DialogDescription>
                </DialogHeader>
              </DialogContent>
            </Dialog>

            {/* Dropdown - Layer 2: Popover */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  Dropdown (Layer 2)
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <div className="px-2 py-1.5">
                  <p className="text-xs font-medium">Popover Layer</p>
                </div>
                <DropdownMenuItem>Option 1</DropdownMenuItem>
                <DropdownMenuItem>Option 2</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Popover Example */}
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" size="sm">
                  Tooltip (Layer 2)
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-48">
                <p className="text-xs">Tooltips use the popover layer</p>
              </PopoverContent>
            </Popover>
          </div>
        </div>

        {/* Interactive State Progression with Button Examples */}
        <div className="mt-6">
          <h3 className="mb-4 text-lg font-medium">Interactive State Progression</h3>

          {/* Button Variants that use these states */}
          <div className="flex items-center gap-3">
            <span className="text-muted-foreground text-sm">Button variants:</span>
            <Button variant="secondary" size="sm">
              Secondary
            </Button>
            <Button variant="outline" size="sm">
              Outline
            </Button>
            <Button variant="ghost" size="sm">
              Ghost
            </Button>
            <span className="text-muted-foreground text-xs">
              ← Hover and click to see state transitions
            </span>
          </div>
        </div>
      </section>
      {/* Interactive Colors - Button Variants */}
      <section>
        <h2 className="mb-6 text-2xl font-bold">Interactive Colors</h2>
        <p className="text-muted-foreground mb-4">
          How color tokens map to interactive components and their states.
        </p>

        {/* Button Variants Matrix */}
        <div className="mb-8">
          <h3 className="mb-4 text-lg font-medium">Button Variants & States</h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="px-3 py-2 text-left text-sm font-medium">Variant</th>
                  <th className="px-3 py-2 text-center text-sm font-medium">Default</th>
                  <th className="px-3 py-2 text-center text-sm font-medium">Hover</th>
                  <th className="px-3 py-2 text-center text-sm font-medium">Active</th>
                  <th className="px-3 py-2 text-center text-sm font-medium">Disabled</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                <tr>
                  <td className="px-3 py-4 text-sm font-medium">Primary (default)</td>
                  <td className="px-3 py-4 text-center">
                    <Button variant="default" size="sm">
                      Button
                    </Button>
                  </td>
                  <td className="px-3 py-4 text-center">
                    <Button variant="default" size="sm" className="hover:bg-foreground/90">
                      Button
                    </Button>
                  </td>
                  <td className="px-3 py-4 text-center">
                    <Button variant="default" size="sm" className="bg-foreground/80">
                      Button
                    </Button>
                  </td>
                  <td className="px-3 py-4 text-center">
                    <Button variant="default" size="sm" disabled>
                      Button
                    </Button>
                  </td>
                </tr>
                <tr>
                  <td className="px-3 py-4 text-sm font-medium">Secondary</td>
                  <td className="px-3 py-4 text-center">
                    <Button variant="secondary" size="sm">
                      Button
                    </Button>
                  </td>
                  <td className="px-3 py-4 text-center">
                    <Button variant="secondary" size="sm" className="hover:bg-surface-hover">
                      Button
                    </Button>
                  </td>
                  <td className="px-3 py-4 text-center">
                    <Button variant="secondary" size="sm" className="bg-surface-active">
                      Button
                    </Button>
                  </td>
                  <td className="px-3 py-4 text-center">
                    <Button variant="secondary" size="sm" disabled>
                      Button
                    </Button>
                  </td>
                </tr>
                <tr>
                  <td className="px-3 py-4 text-sm font-medium">Outline</td>
                  <td className="px-3 py-4 text-center">
                    <Button variant="outline" size="sm">
                      Button
                    </Button>
                  </td>
                  <td className="px-3 py-4 text-center">
                    <Button variant="outline" size="sm" className="hover:bg-surface-hover">
                      Button
                    </Button>
                  </td>
                  <td className="px-3 py-4 text-center">
                    <Button variant="outline" size="sm" className="bg-surface-active">
                      Button
                    </Button>
                  </td>
                  <td className="px-3 py-4 text-center">
                    <Button variant="outline" size="sm" disabled>
                      Button
                    </Button>
                  </td>
                </tr>
                <tr>
                  <td className="px-3 py-4 text-sm font-medium">Ghost</td>
                  <td className="px-3 py-4 text-center">
                    <Button variant="ghost" size="sm">
                      Button
                    </Button>
                  </td>
                  <td className="px-3 py-4 text-center">
                    <Button variant="ghost" size="sm" className="hover:bg-surface-hover">
                      Button
                    </Button>
                  </td>
                  <td className="px-3 py-4 text-center">
                    <Button variant="ghost" size="sm" className="bg-surface-active">
                      Button
                    </Button>
                  </td>
                  <td className="px-3 py-4 text-center">
                    <Button variant="ghost" size="sm" disabled>
                      Button
                    </Button>
                  </td>
                </tr>
                <tr>
                  <td className="px-3 py-4 text-sm font-medium">Destructive</td>
                  <td className="px-3 py-4 text-center">
                    <Button variant="destructive" size="sm">
                      Button
                    </Button>
                  </td>
                  <td className="px-3 py-4 text-center">
                    <Button variant="destructive" size="sm" className="hover:bg-destructive-hover">
                      Button
                    </Button>
                  </td>
                  <td className="px-3 py-4 text-center">
                    <Button variant="destructive" size="sm" className="bg-destructive/80">
                      Button
                    </Button>
                  </td>
                  <td className="px-3 py-4 text-center">
                    <Button variant="destructive" size="sm" disabled>
                      Button
                    </Button>
                  </td>
                </tr>
                <tr>
                  <td className="px-3 py-4 text-sm font-medium">Accent</td>
                  <td className="px-3 py-4 text-center">
                    <Button variant="accent" size="sm">
                      Button
                    </Button>
                  </td>
                  <td className="px-3 py-4 text-center">
                    <Button variant="accent" size="sm" className="hover:bg-accent/90">
                      Button
                    </Button>
                  </td>
                  <td className="px-3 py-4 text-center">
                    <Button variant="accent" size="sm" className="bg-accent/80">
                      Button
                    </Button>
                  </td>
                  <td className="px-3 py-4 text-center">
                    <Button variant="accent" size="sm" disabled>
                      Button
                    </Button>
                  </td>
                </tr>
                <tr>
                  <td className="px-3 py-4 text-sm font-medium">Link</td>
                  <td className="px-3 py-4 text-center">
                    <Button variant="link" size="sm">
                      Button
                    </Button>
                  </td>
                  <td className="px-3 py-4 text-center">
                    <Button variant="link" size="sm" className="hover:underline">
                      Button
                    </Button>
                  </td>
                  <td className="px-3 py-4 text-center">
                    <Button variant="link" size="sm" className="underline">
                      Button
                    </Button>
                  </td>
                  <td className="px-3 py-4 text-center">
                    <Button variant="link" size="sm" disabled>
                      Button
                    </Button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Interactive Playground */}
        <div className="mb-8">
          <h3 className="mb-4 text-lg font-medium">Interactive Playground</h3>
          <p className="text-muted-foreground mb-4 text-sm">
            Hover and click to see state transitions in real-time
          </p>
          <div className="flex flex-wrap gap-3">
            <Button variant="default">Primary</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="outline">Outline</Button>
            <Button variant="ghost">Ghost</Button>
            <Button variant="destructive">Destructive</Button>
            <Button variant="accent">Accent</Button>
            <Button variant="link">Link</Button>
          </div>
        </div>

        {/* Color Usage in Context */}
        <div>
          <h3 className="mb-4 text-lg font-medium">Colors in Context</h3>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {/* Card with Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Card with Actions</CardTitle>
                <CardDescription>Showing primary and secondary actions</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground text-sm">
                  Cards use surface colors with interactive buttons for actions.
                </p>
                <div className="flex gap-2">
                  <Button variant="default" size="sm">
                    Save
                  </Button>
                  <Button variant="outline" size="sm">
                    Cancel
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Form with Input States */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Form Elements</CardTitle>
                <CardDescription>Input states and validation</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <Input placeholder="Normal input" className="h-8" />
                </div>
                <div>
                  <Input
                    placeholder="Focused input"
                    className="border-ring ring-ring/50 h-8 ring-2"
                  />
                </div>
                <div>
                  <Input
                    placeholder="Error state"
                    className="border-destructive h-8"
                    aria-invalid="true"
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
      {/* Semantic Colors */}
      <section>
        <h2 className="mb-6 text-2xl font-bold">Semantic Colors</h2>
        <p className="text-muted-foreground mb-4">
          Colors that convey specific meanings and states.
        </p>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          {/* Success */}
          <div>
            <h3 className="text-success mb-4 text-lg font-medium">Success</h3>
            <div className="grid grid-cols-3 gap-2">
              <div className="bg-background border-border rounded border p-3">
                <div className="bg-success mb-2 h-8 w-full rounded"></div>
                <h4 className="text-xs font-medium">Success</h4>
                <code className="text-muted-foreground text-xs">--green-9</code>
              </div>
              <div className="bg-background border-border rounded border p-3">
                <div className="bg-success-foreground border-border mb-2 h-8 w-full rounded border"></div>
                <h4 className="text-xs font-medium">Foreground</h4>
                <code className="text-muted-foreground text-xs">--gray-12</code>
              </div>
              <div className="bg-background border-border rounded border p-3">
                <div className="bg-success-accent mb-2 h-8 w-full rounded"></div>
                <h4 className="text-xs font-medium">Alpha</h4>
                <code className="text-muted-foreground text-xs">--green-a2</code>
              </div>
            </div>
          </div>

          {/* Warning */}
          <div>
            <h3 className="text-warning mb-4 text-lg font-medium">Warning</h3>
            <div className="grid grid-cols-3 gap-2">
              <div className="bg-background border-border rounded border p-3">
                <div className="bg-warning mb-2 h-8 w-full rounded"></div>
                <h4 className="text-xs font-medium">Warning</h4>
                <code className="text-muted-foreground text-xs">--orange-9</code>
              </div>
              <div className="bg-background border-border rounded border p-3">
                <div className="bg-warning-foreground border-border mb-2 h-8 w-full rounded border"></div>
                <h4 className="text-xs font-medium">Foreground</h4>
                <code className="text-muted-foreground text-xs">--gray-12</code>
              </div>
              <div className="bg-background border-border rounded border p-3">
                <div className="bg-warning-accent mb-2 h-8 w-full rounded"></div>
                <h4 className="text-xs font-medium">Alpha</h4>
                <code className="text-muted-foreground text-xs">--orange-a2</code>
              </div>
            </div>
          </div>

          {/* Error/Destructive */}
          <div>
            <h3 className="text-destructive mb-4 text-lg font-medium">Error</h3>
            <div className="grid grid-cols-3 gap-2">
              <div className="bg-background border-border rounded border p-3">
                <div className="bg-destructive mb-2 h-8 w-full rounded"></div>
                <h4 className="text-xs font-medium">Destructive</h4>
                <code className="text-muted-foreground text-xs">--red-9</code>
              </div>
              <div className="bg-background border-border rounded border p-3">
                <div className="bg-destructive-foreground border-border mb-2 h-8 w-full rounded border"></div>
                <h4 className="text-xs font-medium">Foreground</h4>
                <code className="text-muted-foreground text-xs">--gray-12</code>
              </div>
              <div className="bg-background border-border rounded border p-3">
                <div className="bg-destructive-accent mb-2 h-8 w-full rounded"></div>
                <h4 className="text-xs font-medium">Alpha</h4>
                <code className="text-muted-foreground text-xs">--red-a2</code>
              </div>
            </div>
          </div>

          {/* Info */}
          <div>
            <h3 className="text-info mb-4 text-lg font-medium">Info</h3>
            <div className="grid grid-cols-3 gap-2">
              <div className="bg-background border-border rounded border p-3">
                <div className="bg-info mb-2 h-8 w-full rounded"></div>
                <h4 className="text-xs font-medium">Info</h4>
                <code className="text-muted-foreground text-xs">--blue-9</code>
              </div>
              <div className="bg-background border-border rounded border p-3">
                <div className="bg-info-foreground border-border mb-2 h-8 w-full rounded border"></div>
                <h4 className="text-xs font-medium">Foreground</h4>
                <code className="text-muted-foreground text-xs">--gray-12</code>
              </div>
              <div className="bg-background border-border rounded border p-3">
                <div className="bg-info-accent mb-2 h-8 w-full rounded"></div>
                <h4 className="text-xs font-medium">Alpha</h4>
                <code className="text-muted-foreground text-xs">--blue-a2</code>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* UI Element Colors */}
      <section>
        <h2 className="mb-6 text-2xl font-bold">UI Element Colors</h2>
        <p className="text-muted-foreground mb-4">
          Special purpose colors for borders, inputs, and other UI elements.
        </p>

        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          <div className="bg-background border-border rounded-lg border p-4">
            <div className="border-border mb-2 h-12 w-full rounded border-4"></div>
            <h4 className="text-sm font-medium">Border</h4>
            <code className="text-muted-foreground text-xs">--gray-6</code>
          </div>
          <div className="bg-background border-border rounded-lg border p-4">
            <div className="bg-input mb-2 h-12 w-full rounded"></div>
            <h4 className="text-sm font-medium">Input</h4>
            <code className="text-muted-foreground text-xs">--gray-3</code>
          </div>
          <div className="bg-background border-border rounded-lg border p-4">
            <div className="border-ring mb-2 h-12 w-full rounded border-4"></div>
            <h4 className="text-sm font-medium">Ring (Focus)</h4>
            <code className="text-muted-foreground text-xs">--accent-6</code>
          </div>
          <div className="bg-background border-border rounded-lg border p-4">
            <div className="bg-overlay mb-2 h-12 w-full rounded"></div>
            <h4 className="text-sm font-medium">Overlay</h4>
            <code className="text-muted-foreground text-xs">--black-a8</code>
          </div>
        </div>
      </section>
      {/* Chart Colors */}
      <section>
        <h2 className="mb-6 text-2xl font-bold">Chart Colors</h2>
        <p className="text-muted-foreground mb-4">
          Colors used for data visualizations and charts.
        </p>

        <div className="grid grid-cols-3 gap-4 md:grid-cols-5">
          <div className="bg-background border-border rounded-lg border p-4">
            <div className="bg-chart-1 mb-2 h-12 w-full rounded"></div>
            <h4 className="text-sm font-medium">Chart 1</h4>
            <code className="text-muted-foreground text-xs">Purple</code>
          </div>
          <div className="bg-background border-border rounded-lg border p-4">
            <div className="bg-chart-2 mb-2 h-12 w-full rounded"></div>
            <h4 className="text-sm font-medium">Chart 2</h4>
            <code className="text-muted-foreground text-xs">Teal</code>
          </div>
          <div className="bg-background border-border rounded-lg border p-4">
            <div className="bg-chart-3 mb-2 h-12 w-full rounded"></div>
            <h4 className="text-sm font-medium">Chart 3</h4>
            <code className="text-muted-foreground text-xs">Green</code>
          </div>
          <div className="bg-background border-border rounded-lg border p-4">
            <div className="bg-chart-4 mb-2 h-12 w-full rounded"></div>
            <h4 className="text-sm font-medium">Chart 4</h4>
            <code className="text-muted-foreground text-xs">Pink</code>
          </div>
          <div className="bg-background border-border rounded-lg border p-4">
            <div className="bg-chart-5 mb-2 h-12 w-full rounded"></div>
            <h4 className="text-sm font-medium">Chart 5</h4>
            <code className="text-muted-foreground text-xs">Orange</code>
          </div>
        </div>
      </section>
      {/* Layer Demonstration */}
      <section>
        <h2 className="mb-6 text-2xl font-bold">Layer Hierarchy Demo</h2>
        <p className="text-muted-foreground mb-4">
          How colors work together to create visual depth and hierarchy.
        </p>

        <div className="bg-background border-border relative rounded-lg border p-8">
          <div className="text-muted-foreground mb-4 text-sm">Background Layer (--gray-1)</div>

          <div className="bg-card border-border relative rounded-lg border p-6">
            <div className="text-card-foreground mb-4 text-sm">Surface Layer (--gray-2)</div>

            <div className="bg-surface-hover border-border relative rounded border p-4">
              <div className="mb-4 text-sm">Surface Light Layer (--gray-4)</div>

              <div className="bg-popover border-border relative rounded border p-4 shadow-lg">
                <div className="text-popover-foreground mb-2 text-sm">Popover Layer</div>
                <p className="text-muted-foreground text-xs">Highest layer with shadow</p>
              </div>
            </div>
          </div>
        </div>
      </section>
      // Add this new section after the UI Element Colors section and before Chart Colors
      {/* Text Colors and Typography */}
      <section>
        <h2 className="mb-6 text-2xl font-bold">Text Colors & Typography</h2>
        <p className="text-muted-foreground mb-4">
          How different text colors work across various contexts and backgrounds.
        </p>

        <div className="space-y-8">
          {/* Primary Text Colors */}
          <div>
            <h3 className="mb-4 text-lg font-medium">Primary Text Colors</h3>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              <div className="bg-background border-border rounded-lg border p-6">
                <h4 className="text-foreground mb-2 text-lg font-bold">Foreground</h4>
                <p className="text-foreground mb-3">
                  Main text color for headings and primary content
                </p>
                <code className="bg-muted rounded px-2 py-1 text-xs">
                  text-foreground (--gray-12)
                </code>
              </div>

              <div className="bg-background border-border rounded-lg border p-6">
                <h4 className="text-muted-foreground mb-2 text-lg font-bold">Muted Foreground</h4>
                <p className="text-muted-foreground mb-3">Secondary text, descriptions, captions</p>
                <code className="bg-muted rounded px-2 py-1 text-xs">
                  text-muted-foreground (--gray-10)
                </code>
              </div>

              <div className="bg-card border-border rounded-lg border p-6">
                <h4 className="text-card-foreground mb-2 text-lg font-bold">Card Foreground</h4>
                <p className="text-card-foreground mb-3">Text on card/surface backgrounds</p>
                <code className="bg-muted rounded px-2 py-1 text-xs">
                  text-card-foreground (--gray-12)
                </code>
              </div>
            </div>
          </div>

          {/* Interactive Text Colors */}
          <div>
            <h3 className="mb-4 text-lg font-medium">Interactive Text Colors</h3>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              <div className="bg-background border-border rounded-lg border p-6">
                <h4 className="text-primary mb-2 text-lg font-bold">Primary Text</h4>
                <p className="text-primary mb-3">Links, accent text, call-to-action text</p>
                <code className="bg-muted rounded px-2 py-1 text-xs">
                  text-primary (--accent-9)
                </code>
              </div>

              <div className="bg-background border-border rounded-lg border p-6">
                <h4 className="text-accent-foreground mb-2 text-lg font-bold">Accent Foreground</h4>
                <p className="text-accent-foreground mb-3">Text on accent/primary backgrounds</p>
                <code className="bg-muted rounded px-2 py-1 text-xs">
                  text-accent-foreground (--accent-a11)
                </code>
              </div>

              <div className="bg-background border-border rounded-lg border p-6">
                <h4 className="text-secondary-foreground mb-2 text-lg font-bold">
                  Secondary Foreground
                </h4>
                <p className="text-secondary-foreground mb-3">
                  Text on secondary button backgrounds
                </p>
                <code className="bg-muted rounded px-2 py-1 text-xs">
                  text-secondary-foreground (--gray-12)
                </code>
              </div>
            </div>
          </div>

          {/* Semantic Text Colors */}
          <div>
            <h3 className="mb-4 text-lg font-medium">Semantic Text Colors</h3>
            <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
              <div className="bg-background border-border rounded-lg border p-4">
                <h4 className="text-success mb-2 text-base font-bold">Success Text</h4>
                <p className="text-success mb-2 text-sm">Confirmation messages</p>
                <code className="bg-muted rounded px-2 py-1 text-xs">text-success</code>
              </div>

              <div className="bg-background border-border rounded-lg border p-4">
                <h4 className="text-warning mb-2 text-base font-bold">Warning Text</h4>
                <p className="text-warning mb-2 text-sm">Caution messages</p>
                <code className="bg-muted rounded px-2 py-1 text-xs">text-warning</code>
              </div>

              <div className="bg-background border-border rounded-lg border p-4">
                <h4 className="text-destructive mb-2 text-base font-bold">Error Text</h4>
                <p className="text-destructive mb-2 text-sm">Error messages</p>
                <code className="bg-muted rounded px-2 py-1 text-xs">text-destructive</code>
              </div>

              <div className="bg-background border-border rounded-lg border p-4">
                <h4 className="text-info mb-2 text-base font-bold">Info Text</h4>
                <p className="text-info mb-2 text-sm">Information messages</p>
                <code className="bg-muted rounded px-2 py-1 text-xs">text-info</code>
              </div>
            </div>
          </div>

          {/* Text on Different Backgrounds */}
          <div>
            <h3 className="mb-4 text-lg font-medium">Text on Different Backgrounds</h3>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {/* Light backgrounds */}
              <div>
                <h4 className="mb-3 text-base font-medium">On Primary Background</h4>
                <div className="bg-primary text-primary-foreground mb-3 rounded-lg p-4">
                  <h5 className="mb-1 font-bold">Primary Background</h5>
                  <p className="text-sm opacity-90">
                    White text on primary background for high contrast
                  </p>
                </div>
                <code className="bg-muted rounded px-2 py-1 text-xs">
                  text-primary-foreground (--gray-1)
                </code>
              </div>

              {/* Accent backgrounds */}
              <div>
                <h4 className="mb-3 text-base font-medium">On Success Background</h4>
                <div className="bg-success text-success-foreground mb-3 rounded-lg p-4">
                  <h5 className="mb-1 font-bold">Success Background</h5>
                  <p className="text-sm opacity-90">
                    White text on success background for readability
                  </p>
                </div>
                <code className="bg-muted rounded px-2 py-1 text-xs">
                  text-success-foreground (--gray-12)
                </code>
              </div>

              {/* Muted backgrounds */}
              <div>
                <h4 className="mb-3 text-base font-medium">On Muted Background</h4>
                <div className="bg-muted text-muted-foreground mb-3 rounded-lg p-4">
                  <h5 className="mb-1 font-bold">Muted Background</h5>
                  <p className="text-sm">Dimmed text on muted background for subtle content</p>
                </div>
                <code className="bg-muted rounded px-2 py-1 text-xs">
                  text-muted-foreground (--gray-10)
                </code>
              </div>

              {/* Alpha backgrounds */}
              <div>
                <h4 className="mb-3 text-base font-medium">On Alpha Background</h4>
                <div className="bg-accent text-accent-foreground mb-3 rounded-lg p-4">
                  <h5 className="mb-1 font-bold">Accent Alpha Background</h5>
                  <p className="text-sm">Accent text on translucent accent background</p>
                </div>
                <code className="bg-muted rounded px-2 py-1 text-xs">
                  text-accent-foreground (--accent-a11)
                </code>
              </div>
            </div>
          </div>

          {/* Typography Hierarchy */}
          <div>
            <h3 className="mb-4 text-lg font-medium">Typography Hierarchy</h3>
            <div className="bg-card border-border space-y-4 rounded-lg border p-6">
              <h1 className="text-foreground text-4xl font-bold">Heading 1 - Foreground</h1>
              <h2 className="text-foreground text-3xl font-bold">Heading 2 - Foreground</h2>
              <h3 className="text-foreground text-2xl font-medium">Heading 3 - Foreground</h3>
              <h4 className="text-foreground text-xl font-medium">Heading 4 - Foreground</h4>
              <p className="text-foreground text-base">
                Body text - Foreground color for main content and paragraphs
              </p>
              <p className="text-muted-foreground text-sm">
                Small text - Muted foreground for secondary information
              </p>
              <p className="text-muted-foreground text-xs">
                Caption text - Muted foreground for captions and metadata
              </p>
              <a href="#" className="text-primary hover:text-primary-hover underline">
                Link text - Primary color with hover state
              </a>
            </div>
          </div>
        </div>
      </section>
      {/* Interactive Components Layer Demo */}
      <section>
        <h2 className="mb-6 text-2xl font-bold">Components on Different Surfaces</h2>
        <p className="text-muted-foreground mb-4">
          How interactive components look and behave across different color layers.
        </p>

        <div className="space-y-6">
          {/* On Background */}
          <div className="bg-background space-y-4 rounded-lg border p-6">
            <h3 className="text-lg font-bold">On Background (bg-background)</h3>
            <div className="flex flex-wrap items-center gap-4">
              <Button variant="default">Default</Button>
              <Button variant="accent">Accent</Button>
              <Button variant="secondary">Secondary</Button>
              <Button variant="outline">Outline</Button>
              <Button variant="ghost">Ghost</Button>
              <Button variant="destructive">Destructive</Button>
              <Input placeholder="Input field" className="w-48" />
            </div>
          </div>

          {/* On Card Surface */}
          <Card>
            <CardHeader>
              <CardTitle>On Card Surface (bg-card)</CardTitle>
              <CardDescription>Components on the primary surface layer</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap items-center gap-4">
                <Button variant="default">Default</Button>
                <Button variant="accent">Accent</Button>
                <Button variant="secondary">Secondary</Button>
                <Button variant="outline">Outline</Button>
                <Button variant="ghost">Ghost</Button>

                {/* Select */}
                <Select>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Select option" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">Option 1</SelectItem>
                    <SelectItem value="2">Option 2</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Interactive Elements */}
          <div className="bg-card space-y-4 rounded-lg border p-6">
            <h3 className="text-lg font-bold">Overlays and Popovers</h3>
            <div className="flex flex-wrap gap-4">
              {/* Popover */}
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline">Open Popover</Button>
                </PopoverTrigger>
                <PopoverContent className="w-80">
                  <div className="space-y-2">
                    <h4 className="font-medium">Popover Content</h4>
                    <p className="text-muted-foreground text-sm">
                      This popover uses bg-popover with proper elevation and shadow.
                    </p>
                    <div className="flex gap-2">
                      <Button size="sm">Action</Button>
                      <Button size="sm" variant="outline">
                        Cancel
                      </Button>
                    </div>
                  </div>
                </PopoverContent>
              </Popover>

              {/* Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline">Open Dropdown</Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56">
                  <DropdownMenuItem>Profile Settings</DropdownMenuItem>
                  <DropdownMenuItem>Team Settings</DropdownMenuItem>
                  <DropdownMenuItem>Billing</DropdownMenuItem>
                  <DropdownMenuItem variant="destructive">Delete Account</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Dialog */}
              <Dialog>
                <DialogTrigger asChild>
                  <Button>Open Dialog</Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Dialog Example</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <p className="text-muted-foreground text-sm">
                      Dialogs use bg-background with an overlay backdrop for focus.
                    </p>
                    <Input placeholder="Enter value" />
                    <div className="flex justify-end gap-2">
                      <Button variant="outline">Cancel</Button>
                      <Button>Save Changes</Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>

          {/* Button Variants Showcase */}
          <div className="bg-background space-y-4 rounded-lg border p-6">
            <h3 className="text-lg font-bold">Button Variants Across Surfaces</h3>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="bg-background rounded border p-4">
                <h4 className="mb-3 text-sm font-medium">On Background</h4>
                <div className="flex flex-wrap gap-2">
                  <Button variant="default" size="sm">
                    Default
                  </Button>
                  <Button variant="accent" size="sm">
                    Accent
                  </Button>
                  <Button variant="secondary" size="sm">
                    Secondary
                  </Button>
                  <Button variant="destructive" size="sm">
                    Destructive
                  </Button>
                </div>
              </div>
              <div className="bg-card rounded border p-4">
                <h4 className="mb-3 text-sm font-medium">On Surface</h4>
                <div className="flex flex-wrap gap-2">
                  <Button variant="default" size="sm">
                    Default
                  </Button>
                  <Button variant="accent" size="sm">
                    Accent
                  </Button>
                  <Button variant="secondary" size="sm">
                    Secondary
                  </Button>
                  <Button variant="destructive" size="sm">
                    Destructive
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  ),
};
