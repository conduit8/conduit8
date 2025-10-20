import type { Meta, StoryObj } from '@storybook/react-vite';

import { Button } from '@web/ui/components/atoms/buttons/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@web/ui/components/overlays/dropdown-menu';
import { Popover, PopoverContent, PopoverTrigger } from '@web/ui/components/overlays/popover';
import { Heart, LogOut, Settings, Star, User } from 'lucide-react';
import { useState } from 'react';

const meta: Meta = {
  title: 'Components/UI/Overlays/Comparison',
  parameters: {
    layout: 'centered',
  },
};

export default meta;
type Story = StoryObj;

export const PopoverVsDropdown: Story = {
  render: () => {
    const [selectedPopover, setSelectedPopover] = useState<string>('profile');

    return (
      <div className="flex gap-8 p-12">
        {/* Popover with custom menu items */}
        <div className="flex flex-col items-center gap-4">
          <h3 className="text-sm font-medium text-muted-foreground">Popover (Custom Styling)</h3>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline">Open Popover</Button>
            </PopoverTrigger>
            <PopoverContent className="w-56 p-1">
              <div className="flex flex-col gap-0.5">
                <button
                  onClick={() => setSelectedPopover('profile')}
                  className={`flex items-center gap-2 rounded-sm px-2 py-1.5 text-sm ${
                    selectedPopover === 'profile'
                      ? 'bg-accent text-accent-foreground'
                      : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                  }`}
                >
                  <User className="h-4 w-4" />
                  Profile
                </button>
                <button
                  onClick={() => setSelectedPopover('settings')}
                  className={`flex items-center gap-2 rounded-sm px-2 py-1.5 text-sm ${
                    selectedPopover === 'settings'
                      ? 'bg-accent text-accent-foreground'
                      : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                  }`}
                >
                  <Settings className="h-4 w-4" />
                  Settings
                </button>
                <button
                  onClick={() => setSelectedPopover('favorites')}
                  className={`flex items-center gap-2 rounded-sm px-2 py-1.5 text-sm ${
                    selectedPopover === 'favorites'
                      ? 'bg-accent text-accent-foreground'
                      : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                  }`}
                >
                  <Star className="h-4 w-4" />
                  Favorites
                </button>
                <div className="my-1 h-px bg-border" />
                <button className="flex items-center gap-2 rounded-sm px-2 py-1.5 text-sm text-destructive hover:bg-destructive/10">
                  <LogOut className="h-4 w-4" />
                  Logout
                </button>
              </div>
            </PopoverContent>
          </Popover>
        </div>

        {/* DropdownMenu with built-in styling */}
        <div className="flex flex-col items-center gap-4">
          <h3 className="text-sm font-medium text-muted-foreground">DropdownMenu (Built-in Styling)</h3>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">Open Dropdown</Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56">
              <DropdownMenuItem icon={<User />}>Profile</DropdownMenuItem>
              <DropdownMenuItem icon={<Settings />}>Settings</DropdownMenuItem>
              <DropdownMenuItem icon={<Star />}>Favorites</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem variant="destructive" icon={<LogOut />}>
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    );
  },
};

export const HoverStateFocus: Story = {
  render: () => (
    <div className="flex gap-8 p-12">
      <div className="flex flex-col gap-4">
        <h3 className="text-sm font-medium">Popover - Inline Styles</h3>
        <div className="rounded-md border p-4">
          <div className="space-y-1">
            <div className="text-xs text-muted-foreground mb-2">Current implementation:</div>
            <div className="rounded-sm px-2 py-1.5 text-sm hover:bg-muted">
              hover:bg-muted
            </div>
            <div className="rounded-sm px-2 py-1.5 text-sm bg-accent text-accent-foreground">
              bg-accent (selected)
            </div>
            <div className="rounded-sm px-2 py-1.5 text-sm bg-accent text-accent-foreground hover:bg-accent/90">
              hover:bg-accent/90 (selected hover)
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-4">
        <h3 className="text-sm font-medium">DropdownMenu - Component Styles</h3>
        <div className="rounded-md border p-4">
          <div className="space-y-1">
            <div className="text-xs text-muted-foreground mb-2">Current implementation:</div>
            <div className="rounded-sm px-2 py-1.5 text-sm text-muted-foreground hover:bg-surface-hover hover:text-foreground">
              hover:bg-surface-hover
            </div>
            <div className="rounded-sm px-2 py-1.5 text-sm text-muted-foreground focus:bg-surface-hover focus:text-foreground">
              focus:bg-surface-hover
            </div>
            <div className="rounded-sm px-2 py-1.5 text-sm text-destructive hover:bg-destructive/10">
              hover:bg-destructive/10 (destructive)
            </div>
          </div>
        </div>
      </div>
    </div>
  ),
};
