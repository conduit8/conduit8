import { cn } from '@web/lib/utils';
import React from 'react';

interface ContentGridProps {
  children: React.ReactNode;
  columns?: 1 | 2 | 3 | 4;
  className?: string;
}

/**
 * ContentGrid - Flexible grid system for content layouts
 *
 * @example Simple equal columns
 * <ContentGrid columns={2}>
 *   <Card>First item</Card>
 *   <Card>Second item</Card>
 * </ContentGrid>
 *
 * @example Custom 12-column layout (main + sidebar)
 * <ContentGrid.Custom>
 *   <ContentGrid.Col8>Main content (66.67%)</ContentGrid.Col8>
 *   <ContentGrid.Col4>Sidebar (33.33%)</ContentGrid.Col4>
 * </ContentGrid.Custom>
 */
export const ContentGrid = ({ children, columns = 2, className }: ContentGridProps) => {
  const gridClass = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-3',
    4: 'grid-cols-1 sm:grid-cols-2 md:grid-cols-4',
  }[columns];

  return <div className={cn('grid gap-lg', gridClass, className)}>{children}</div>;
};

/**
 * Custom 12-column grid for asymmetric layouts
 * The page width is divided into 12 columns, allowing flexible combinations
 */
ContentGrid.Custom = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => <div className={cn('grid grid-cols-1 md:grid-cols-12 gap-lg', className)}>{children}</div>;

/** 8/12 columns (66.67% width) - Typically used for main content */
ContentGrid.Col8 = ({ children, className }: { children: React.ReactNode; className?: string }) => (
  <div className={cn('md:col-span-8', className)}>{children}</div>
);

/** 4/12 columns (33.33% width) - Typically used for sidebars */
ContentGrid.Col4 = ({ children, className }: { children: React.ReactNode; className?: string }) => (
  <div className={cn('md:col-span-4', className)}>{children}</div>
);

/** 6/12 columns (50% width) - For half-width layouts */
ContentGrid.Col6 = ({ children, className }: { children: React.ReactNode; className?: string }) => (
  <div className={cn('md:col-span-6', className)}>{children}</div>
);

/** 3/12 columns (25% width) - For quarter-width layouts */
ContentGrid.Col3 = ({ children, className }: { children: React.ReactNode; className?: string }) => (
  <div className={cn('md:col-span-3', className)}>{children}</div>
);
