import type { Meta, StoryObj } from '@storybook/react-vite';

import { ChevronDownIcon, LayersIcon, MousePointerClickIcon } from 'lucide-react';

import { Button } from '../atoms/buttons/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../overlays/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../overlays/dropdown-menu';
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
} from './base/sidebar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './containers/card';

const meta: Meta<typeof ColorHierarchyShowcase> = {
  title: 'Design System/Color Hierarchy',
  parameters: {
    layout: 'padded',
  },
};

export default meta;
type Story = StoryObj<typeof ColorHierarchyShowcase>;

function ColorHierarchyShowcase() {
  return (
    <div className="space-y-12">
      {/* Visual Layer Stack */}
      <section>
        <h2 className="mb-6">Visual Layer Stack</h2>
        <div className="bg-background relative h-96 rounded-lg border p-8">
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-muted-foreground text-sm">
              Layer 0: Background (--background)
            </span>
          </div>

          {/* Surface Layer */}
          <div className="bg-surface relative z-10 mx-auto mt-8 max-w-md rounded-lg border p-6 shadow-sm">
            <span className="text-sm font-medium">Layer 1: Surface (--surface)</span>
            <p className="text-muted-foreground mt-1 text-xs">Cards, Sidebar, Panels</p>

            {/* Popover Layer */}
            <div className="bg-popover absolute -top-4 right-4 z-20 rounded-md border p-3 shadow-md">
              <span className="text-xs font-medium">Layer 2: Popover (--popover)</span>
              <p className="text-muted-foreground text-xs">Dropdowns, Tooltips</p>
            </div>
          </div>
        </div>
      </section>

      {/* Component Color Usage */}
      <section>
        <h2 className="mb-6">Component Layer Usage</h2>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {/* Card Component */}
          <div>
            <h3 className="mb-3 text-sm font-medium">Card Component</h3>
            <Card>
              <CardHeader>
                <CardTitle>Layer 1: Surface</CardTitle>
                <CardDescription>bg-card → --surface</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-sm">
                  Cards use the surface layer (--surface) to elevate content above the background.
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Dialog Component */}
          <div>
            <h3 className="mb-3 text-sm font-medium">Dialog Component</h3>
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline">Open Dialog</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Layer 0: Background</DialogTitle>
                  <DialogDescription>bg-background → --background</DialogDescription>
                </DialogHeader>
                <p className="text-muted-foreground text-sm">
                  Dialogs return to the background layer for maximum contrast with the overlay.
                </p>
              </DialogContent>
            </Dialog>
          </div>

          {/* Dropdown Component */}
          <div>
            <h3 className="mb-3 text-sm font-medium">Dropdown Component</h3>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">
                  Layer 2: Popover <ChevronDownIcon className="ml-2 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem>bg-popover → --popover</DropdownMenuItem>
                <DropdownMenuItem>Floats above surface</DropdownMenuItem>
                <DropdownMenuItem>Higher elevation</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </section>

      {/* Interactive States */}
      <section>
        <h2 className="mb-6">Interactive State Progression</h2>
        <div className="space-y-4">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
            <div className="bg-surface rounded-lg border p-4">
              <span className="text-sm font-medium">Default</span>
              <p className="text-muted-foreground mt-1 text-xs">--surface</p>
            </div>
            <div className="bg-surface-hover rounded-lg border p-4">
              <span className="text-sm font-medium">Hover</span>
              <p className="text-muted-foreground mt-1 text-xs">--surface-hover</p>
            </div>
            <div className="bg-surface-active rounded-lg border p-4">
              <span className="text-sm font-medium">Active/Pressed</span>
              <p className="text-muted-foreground mt-1 text-xs">--surface-active</p>
            </div>
            <div className="bg-accent text-accent-foreground rounded-lg border p-4">
              <span className="text-sm font-medium">Selected</span>
              <p className="mt-1 text-xs">iris-9 (accent)</p>
            </div>
          </div>

          {/* Interactive Examples */}
          <div className="mt-8">
            <h3 className="mb-4 text-sm font-medium">Interactive Components</h3>
            <div className="flex flex-wrap gap-4">
              <Button variant="secondary">Secondary Button (hover me)</Button>
              <Button variant="ghost">Ghost Button (hover me)</Button>
              <Button variant="outline">Outline Button (hover me)</Button>
            </div>
          </div>
        </div>
      </section>

      {/* Sidebar Example */}
      <section>
        <h2 className="mb-6">Sidebar Layer & States</h2>
        <div className="h-64 overflow-hidden rounded-lg border">
          <SidebarProvider defaultOpen={true}>
            <div className="flex h-full">
              <Sidebar collapsible="none">
                <SidebarHeader className="px-4 py-2">
                  <span className="text-sm font-medium">Layer 1: Surface (--surface)</span>
                </SidebarHeader>
                <SidebarContent>
                  <SidebarMenu>
                    <SidebarMenuItem>
                      <SidebarMenuButton>
                        <LayersIcon className="h-4 w-4" />
                        <span>Default state</span>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                    <SidebarMenuItem>
                      <SidebarMenuButton isActive>
                        <MousePointerClickIcon className="h-4 w-4" />
                        <span>Active state (--surface-hover)</span>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                    <SidebarMenuItem>
                      <SidebarMenuButton>
                        <span className="text-xs">Hover me for --surface-hover</span>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  </SidebarMenu>
                </SidebarContent>
              </Sidebar>
              <main className="bg-background flex-1 p-6">
                <p className="text-muted-foreground text-sm">
                  Main content area uses background (--background) while sidebar uses surface
                  (--surface)
                </p>
              </main>
            </div>
          </SidebarProvider>
        </div>
      </section>

      {/* Color Values Reference */}
      <section>
        <h2 className="mb-6">Layer Color Values</h2>
        <div className="space-y-2">
          <div className="grid grid-cols-[200px_1fr_auto] items-center gap-4 rounded-lg border p-3">
            <span className="text-sm font-medium">Background</span>
            <div className="bg-background h-10 rounded border" />
            <code className="text-xs">--background</code>
          </div>
          <div className="grid grid-cols-[200px_1fr_auto] items-center gap-4 rounded-lg border p-3">
            <span className="text-sm font-medium">Surface / Card / Sidebar</span>
            <div className="bg-surface h-10 rounded border" />
            <code className="text-xs">--surface</code>
          </div>
          <div className="grid grid-cols-[200px_1fr_auto] items-center gap-4 rounded-lg border p-3">
            <span className="text-sm font-medium">Popover / Muted</span>
            <div className="bg-popover h-10 rounded border" />
            <code className="text-xs">--popover</code>
          </div>
          <div className="grid grid-cols-[200px_1fr_auto] items-center gap-4 rounded-lg border p-3">
            <span className="text-sm font-medium">Surface Hover</span>
            <div className="bg-surface-hover h-10 rounded border" />
            <code className="text-xs">--surface-hover</code>
          </div>
          <div className="grid grid-cols-[200px_1fr_auto] items-center gap-4 rounded-lg border p-3">
            <span className="text-sm font-medium">Surface Active</span>
            <div className="bg-surface-active h-10 rounded border" />
            <code className="text-xs">--surface-active</code>
          </div>
        </div>
      </section>
    </div>
  );
}

export const Default: Story = {
  render: () => <ColorHierarchyShowcase />,
};

export const CompactView: Story = {
  render: () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Color Surface Hierarchy</CardTitle>
          <CardDescription>
            Our design system uses a clear layering system based on Radix UI sand scale
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-center gap-4">
              <div className="bg-background h-16 w-16 rounded border" />
              <div>
                <p className="font-medium">Layer 0: Background</p>
                <p className="text-muted-foreground text-sm">Base canvas (--background)</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="bg-surface h-16 w-16 rounded border" />
              <div>
                <p className="font-medium">Layer 1: Surface</p>
                <p className="text-muted-foreground text-sm">Cards, Sidebar (--surface)</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="bg-popover h-16 w-16 rounded border" />
              <div>
                <p className="font-medium">Layer 2: Popover</p>
                <p className="text-muted-foreground text-sm">Dropdowns, Tooltips (--popover)</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  ),
};
