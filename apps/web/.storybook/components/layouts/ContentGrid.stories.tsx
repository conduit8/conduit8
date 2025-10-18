import type { Meta, StoryObj } from '@storybook/react-vite';

import { ContentGrid } from './ContentGrid';

const meta = {
  title: 'Components/Layout/Grids',
  component: ContentGrid,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof ContentGrid>;

export default meta;
type Story = StoryObj<typeof meta>;

// Helper component to visualize grid items
const GridItem = ({
  children,
  className = '',
}: {
  children: React.ReactNode;
  className?: string;
}) => (
  <div className={`bg-muted border-border rounded-lg border p-4 ${className}`}>
    <div className="mb-2 text-sm font-medium">{children}</div>
    <div className="text-muted-foreground text-xs">Grid content area</div>
  </div>
);

/**
 * Single column layout - Full width content
 */
export const SingleColumn: Story = {
  args: {
    columns: 1,
  },
  render: (args) => (
    <ContentGrid {...args}>
      <GridItem>Full Width Content</GridItem>
    </ContentGrid>
  ),
};

/**
 * Two column layout - Equal width columns
 */
export const TwoColumns: Story = {
  args: {
    columns: 2,
  },
  render: (args) => (
    <ContentGrid {...args}>
      <GridItem>Column 1 (50%)</GridItem>
      <GridItem>Column 2 (50%)</GridItem>
    </ContentGrid>
  ),
};

/**
 * Three column layout - Equal width columns
 */
export const ThreeColumns: Story = {
  args: {
    columns: 3,
  },
  render: (args) => (
    <ContentGrid {...args}>
      <GridItem>Column 1 (33.33%)</GridItem>
      <GridItem>Column 2 (33.33%)</GridItem>
      <GridItem>Column 3 (33.33%)</GridItem>
    </ContentGrid>
  ),
};

/**
 * Four column layout - Equal width columns
 */
export const FourColumns: Story = {
  args: {
    columns: 4,
  },
  render: (args) => (
    <ContentGrid {...args}>
      <GridItem>Col 1 (25%)</GridItem>
      <GridItem>Col 2 (25%)</GridItem>
      <GridItem>Col 3 (25%)</GridItem>
      <GridItem>Col 4 (25%)</GridItem>
    </ContentGrid>
  ),
};

/**
 * Custom 12-column grid - Main content + Sidebar
 * Most common asymmetric layout pattern
 */
export const MainWithSidebar: Story = {
  render: () => (
    <ContentGrid.Custom>
      <ContentGrid.Col8>
        <GridItem className="min-h-[300px]">Main Content Area (8/12 = 66.67%)</GridItem>
      </ContentGrid.Col8>
      <ContentGrid.Col4>
        <GridItem className="min-h-[300px]">Sidebar (4/12 = 33.33%)</GridItem>
      </ContentGrid.Col4>
    </ContentGrid.Custom>
  ),
};

/**
 * Custom 12-column grid - Two equal halves
 */
export const TwoHalves: Story = {
  render: () => (
    <ContentGrid.Custom>
      <ContentGrid.Col6>
        <GridItem className="min-h-[200px]">Left Half (6/12 = 50%)</GridItem>
      </ContentGrid.Col6>
      <ContentGrid.Col6>
        <GridItem className="min-h-[200px]">Right Half (6/12 = 50%)</GridItem>
      </ContentGrid.Col6>
    </ContentGrid.Custom>
  ),
};

/**
 * Custom 12-column grid - Three thirds
 */
export const ThreeThirds: Story = {
  render: () => (
    <ContentGrid.Custom>
      <ContentGrid.Col4>
        <GridItem>First Third (4/12)</GridItem>
      </ContentGrid.Col4>
      <ContentGrid.Col4>
        <GridItem>Second Third (4/12)</GridItem>
      </ContentGrid.Col4>
      <ContentGrid.Col4>
        <GridItem>Third Third (4/12)</GridItem>
      </ContentGrid.Col4>
    </ContentGrid.Custom>
  ),
};

/**
 * Custom 12-column grid - Four quarters
 */
export const FourQuarters: Story = {
  render: () => (
    <ContentGrid.Custom>
      <ContentGrid.Col3>
        <GridItem>Q1 (3/12)</GridItem>
      </ContentGrid.Col3>
      <ContentGrid.Col3>
        <GridItem>Q2 (3/12)</GridItem>
      </ContentGrid.Col3>
      <ContentGrid.Col3>
        <GridItem>Q3 (3/12)</GridItem>
      </ContentGrid.Col3>
      <ContentGrid.Col3>
        <GridItem>Q4 (3/12)</GridItem>
      </ContentGrid.Col3>
    </ContentGrid.Custom>
  ),
};

/**
 * Complex layout example - Mixed column sizes
 * Shows how different column combinations can create complex layouts
 */
export const ComplexLayout: Story = {
  render: () => (
    <div className="space-y-4">
      <div className="mb-2 text-sm font-medium">Header - Full Width</div>
      <ContentGrid columns={1}>
        <GridItem>Header Content</GridItem>
      </ContentGrid>

      <div className="mb-2 text-sm font-medium">Main Content Area</div>
      <ContentGrid.Custom>
        <ContentGrid.Col8>
          <GridItem className="min-h-[200px]">Main Article Content</GridItem>
        </ContentGrid.Col8>
        <ContentGrid.Col4>
          <div className="space-y-4">
            <GridItem>Related Links</GridItem>
            <GridItem>Advertisement</GridItem>
          </div>
        </ContentGrid.Col4>
      </ContentGrid.Custom>

      <div className="mb-2 text-sm font-medium">Footer - Three Columns</div>
      <ContentGrid columns={3}>
        <GridItem>Footer Col 1</GridItem>
        <GridItem>Footer Col 2</GridItem>
        <GridItem>Footer Col 3</GridItem>
      </ContentGrid>
    </div>
  ),
};

/**
 * Responsive behavior demonstration
 * Shows how grids adapt to different screen sizes
 */
export const ResponsiveBehavior: Story = {
  render: () => (
    <div className="space-y-6">
      <div>
        <h3 className="mb-2 text-sm font-medium">Resize browser to see responsive behavior</h3>
        <p className="text-muted-foreground mb-4 text-xs">
          All grids stack to single column on mobile, then expand at breakpoints
        </p>
      </div>

      <div>
        <div className="mb-2 text-sm font-medium">2 Columns (stacks on mobile)</div>
        <ContentGrid columns={2}>
          <GridItem>Column 1</GridItem>
          <GridItem>Column 2</GridItem>
        </ContentGrid>
      </div>

      <div>
        <div className="mb-2 text-sm font-medium">Custom Grid (stacks on mobile)</div>
        <ContentGrid.Custom>
          <ContentGrid.Col8>
            <GridItem>Main (8/12 on desktop)</GridItem>
          </ContentGrid.Col8>
          <ContentGrid.Col4>
            <GridItem>Sidebar (4/12 on desktop)</GridItem>
          </ContentGrid.Col4>
        </ContentGrid.Custom>
      </div>
    </div>
  ),
};
