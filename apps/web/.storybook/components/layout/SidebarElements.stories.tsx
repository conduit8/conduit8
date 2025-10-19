import type { Meta, StoryObj } from '@storybook/react-vite';

import { Badge } from '@web/ui/components/atoms/indicators';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarSeparator,
} from '@web/ui/components/layout/sidebar/sidebar';
import { cn } from '@web/shared/utils/utils.ts';
import { BookOpen, Home, LifeBuoy, MessageSquare, Settings, User } from 'lucide-react';
import React, { useRef } from 'react';

// Define the background colors we want to test
const backgroundColors = [
  {
    name: 'Sidebar (--sidebar)',
    class: 'bg-sidebar text-sidebar-foreground',
    description: 'Default sidebar background',
  },
  {
    name: 'Background (--background)',
    class: 'bg-background text-foreground',
    description: 'Main app background',
  },
];

// Component to display sidebar elements
const SidebarElements = (): JSX.Element => {
  // Create refs for all required components
  const sidebarRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const footerRef = useRef<HTMLDivElement>(null);
  const separatorRef = useRef<HTMLDivElement>(null);

  // Group refs
  const defaultGroupRef = useRef<HTMLDivElement>(null);
  const outlineGroupRef = useRef<HTMLDivElement>(null);
  const ghostGroupRef = useRef<HTMLDivElement>(null);

  // Label refs
  const defaultLabelRef = useRef<HTMLDivElement>(null);
  const outlineLabelRef = useRef<HTMLDivElement>(null);
  const ghostLabelRef = useRef<HTMLDivElement>(null);

  // Menu refs
  const defaultMenuRef = useRef<HTMLUListElement>(null);
  const outlineMenuRef = useRef<HTMLUListElement>(null);
  const ghostMenuRef = useRef<HTMLUListElement>(null);

  // Default variant button refs
  const defaultButtonRef = useRef<HTMLButtonElement>(null);
  const defaultActiveButtonRef = useRef<HTMLButtonElement>(null);
  const defaultDisabledButtonRef = useRef<HTMLButtonElement>(null);
  const defaultWithBadgeButtonRef = useRef<HTMLButtonElement>(null);

  // Outline variant button refs
  const outlineButtonRef = useRef<HTMLButtonElement>(null);
  const outlineActiveButtonRef = useRef<HTMLButtonElement>(null);
  const outlineDisabledButtonRef = useRef<HTMLButtonElement>(null);
  const outlineWithBadgeButtonRef = useRef<HTMLButtonElement>(null);

  // Ghost variant button refs
  const ghostButtonRef = useRef<HTMLButtonElement>(null);
  const ghostActiveButtonRef = useRef<HTMLButtonElement>(null);
  const ghostDisabledButtonRef = useRef<HTMLButtonElement>(null);
  const ghostWithBadgeButtonRef = useRef<HTMLButtonElement>(null);

  // MenuItem refs
  const menuItemRefs = Array.from({ length: 12 }).map(() => useRef<HTMLLIElement>(null));
  const menuBadgeRefs = Array.from({ length: 3 }).map(() => useRef<HTMLDivElement>(null));

  return (
    <div className="space-y-8 p-4">
      <h2 className="text-2xl font-bold">Sidebar Elements on Different Backgrounds</h2>

      <div className="space-y-6">
        {backgroundColors.map((bg) => (
          <div key={bg.name} className="space-y-2">
            <h3 className="text-lg font-bold">{bg.name}</h3>
            <p className="text-muted-foreground text-sm">{bg.description}</p>

            <div className={cn('rounded-md p-4', bg.class)}>
              <SidebarProvider ref={sidebarRef}>
                <div className="border-border w-full max-w-xs overflow-hidden rounded-md border">
                  <SidebarHeader ref={headerRef} className="border-border border-b">
                    <div className="flex items-center gap-2 p-4">
                      <div className="bg-primary text-primary-foreground rounded-md p-2">
                        <Settings size={16} />
                      </div>
                      <span className="font-bold">App Name</span>
                    </div>
                  </SidebarHeader>

                  <SidebarContent ref={contentRef} className="py-4">
                    {/* Default Variant Group */}
                    <SidebarGroup ref={defaultGroupRef}>
                      <SidebarGroupLabel ref={defaultLabelRef} className="mb-2 px-4">
                        Default Variant
                      </SidebarGroupLabel>
                      <SidebarMenu ref={defaultMenuRef}>
                        <SidebarMenuItem ref={menuItemRefs[0]}>
                          <SidebarMenuButton ref={defaultButtonRef} variant="default">
                            <Home size={16} />
                            <span>Default State</span>
                          </SidebarMenuButton>
                        </SidebarMenuItem>

                        <SidebarMenuItem ref={menuItemRefs[1]}>
                          <SidebarMenuButton
                            ref={defaultActiveButtonRef}
                            isActive
                            variant="default"
                          >
                            <Home size={16} />
                            <span>Active State</span>
                          </SidebarMenuButton>
                        </SidebarMenuItem>

                        <SidebarMenuItem ref={menuItemRefs[2]}>
                          <SidebarMenuButton
                            ref={defaultDisabledButtonRef}
                            disabled
                            variant="default"
                          >
                            <Home size={16} />
                            <span>Disabled State</span>
                          </SidebarMenuButton>
                        </SidebarMenuItem>

                        <SidebarMenuItem ref={menuItemRefs[3]}>
                          <SidebarMenuButton ref={defaultWithBadgeButtonRef} variant="default">
                            <Home size={16} />
                            <span>With Badge</span>
                            <SidebarMenuBadge ref={menuBadgeRefs[0]}>
                              <Badge variant="outline" colorScheme="primary">
                                New
                              </Badge>
                            </SidebarMenuBadge>
                          </SidebarMenuButton>
                        </SidebarMenuItem>
                      </SidebarMenu>
                    </SidebarGroup>

                    <SidebarSeparator ref={separatorRef} className="my-4" />

                    {/* Outline Variant Group */}
                    <SidebarGroup ref={outlineGroupRef}>
                      <SidebarGroupLabel ref={outlineLabelRef} className="mb-2 px-4">
                        Outline Variant
                      </SidebarGroupLabel>
                      <SidebarMenu ref={outlineMenuRef}>
                        <SidebarMenuItem ref={menuItemRefs[4]}>
                          <SidebarMenuButton ref={outlineButtonRef} variant="outline">
                            <BookOpen size={16} />
                            <span>Default State</span>
                          </SidebarMenuButton>
                        </SidebarMenuItem>

                        <SidebarMenuItem ref={menuItemRefs[5]}>
                          <SidebarMenuButton
                            ref={outlineActiveButtonRef}
                            isActive
                            variant="outline"
                          >
                            <BookOpen size={16} />
                            <span>Active State</span>
                          </SidebarMenuButton>
                        </SidebarMenuItem>

                        <SidebarMenuItem ref={menuItemRefs[6]}>
                          <SidebarMenuButton
                            ref={outlineDisabledButtonRef}
                            disabled
                            variant="outline"
                          >
                            <BookOpen size={16} />
                            <span>Disabled State</span>
                          </SidebarMenuButton>
                        </SidebarMenuItem>

                        <SidebarMenuItem ref={menuItemRefs[7]}>
                          <SidebarMenuButton ref={outlineWithBadgeButtonRef} variant="outline">
                            <BookOpen size={16} />
                            <span>With Badge</span>
                            <SidebarMenuBadge ref={menuBadgeRefs[1]}>
                              <Badge variant="outline" colorScheme="primary">
                                New
                              </Badge>
                            </SidebarMenuBadge>
                          </SidebarMenuButton>
                        </SidebarMenuItem>
                      </SidebarMenu>
                    </SidebarGroup>

                    <SidebarSeparator className="my-4" />

                    {/* Ghost Variant Group */}
                    <SidebarGroup ref={ghostGroupRef}>
                      <SidebarGroupLabel ref={ghostLabelRef} className="mb-2 px-4">
                        Ghost Variant
                      </SidebarGroupLabel>
                      <SidebarMenu ref={ghostMenuRef}>
                        <SidebarMenuItem ref={menuItemRefs[8]}>
                          <SidebarMenuButton ref={ghostButtonRef} variant="ghost">
                            <MessageSquare size={16} />
                            <span>Default State</span>
                          </SidebarMenuButton>
                        </SidebarMenuItem>

                        <SidebarMenuItem ref={menuItemRefs[9]}>
                          <SidebarMenuButton ref={ghostActiveButtonRef} isActive variant="ghost">
                            <MessageSquare size={16} />
                            <span>Active State</span>
                          </SidebarMenuButton>
                        </SidebarMenuItem>

                        <SidebarMenuItem ref={menuItemRefs[10]}>
                          <SidebarMenuButton ref={ghostDisabledButtonRef} disabled variant="ghost">
                            <MessageSquare size={16} />
                            <span>Disabled State</span>
                          </SidebarMenuButton>
                        </SidebarMenuItem>

                        <SidebarMenuItem ref={menuItemRefs[11]}>
                          <SidebarMenuButton ref={ghostWithBadgeButtonRef} variant="ghost">
                            <MessageSquare size={16} />
                            <span>With Badge</span>
                            <SidebarMenuBadge ref={menuBadgeRefs[2]}>
                              <Badge variant="outline" colorScheme="primary">
                                New
                              </Badge>
                            </SidebarMenuBadge>
                          </SidebarMenuButton>
                        </SidebarMenuItem>
                      </SidebarMenu>
                    </SidebarGroup>
                  </SidebarContent>

                  <SidebarFooter ref={footerRef} className="border-border border-t p-4">
                    <div className="flex items-center gap-2">
                      <div className="bg-muted text-muted-foreground rounded-full p-2">
                        <User size={16} />
                      </div>
                      <span>User Profile</span>
                    </div>
                  </SidebarFooter>
                </div>
              </SidebarProvider>
            </div>
          </div>
        ))}
      </div>

      <div className="border-border bg-background mt-8 rounded-md border p-4">
        <h3 className="mb-4 text-lg font-bold">Sidebar Component Usage Guidelines</h3>

        <div className="space-y-4">
          <div>
            <h4 className="font-medium">Button Variants</h4>
            <ul className="text-muted-foreground ml-4 list-inside list-disc text-sm">
              <li>
                <strong>Default</strong>: Standard sidebar button with accent hover effect
              </li>
              <li>
                <strong>Outline</strong>: Button with border and surface-hover effect
              </li>
              <li>
                <strong>Ghost</strong>: Text-only button with minimal styling
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-medium">Button States</h4>
            <ul className="text-muted-foreground ml-4 list-inside list-disc text-sm">
              <li>
                <strong>Default</strong>: Normal state
              </li>
              <li>
                <strong>Active</strong>: Currently selected item (uses accent background)
              </li>
              <li>
                <strong>Disabled</strong>: Unavailable item (grayed out)
              </li>
              <li>
                <strong>With Badge</strong>: Item with additional indicator
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-medium">Usage Guidelines</h4>
            <ul className="text-muted-foreground ml-4 list-inside list-disc text-sm">
              <li>
                Use <strong>Default</strong> for primary navigation items
              </li>
              <li>
                Use <strong>Outline</strong> for secondary or grouped items
              </li>
              <li>
                Use <strong>Ghost</strong> for subtle or tertiary actions
              </li>
              <li>
                Apply <strong>Active</strong> state to indicate current location
              </li>
              <li>Use badges sparingly to highlight important updates</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

const meta: Meta = {
  title: 'Components/Layout/SidebarElements',
  parameters: {
    layout: 'fullscreen',
  },
};

export default meta;
type Story = StoryObj;

export const AllSidebarElements: Story = {
  render: () => <SidebarElements />,
};
