import { cn } from '@web/lib/utils';

export interface PageLayoutProps {
  header?: React.ReactNode;
  footer?: React.ReactNode;
  children?: React.ReactNode;

  // Width constraints
  variant?: 'default' | 'narrow' | 'full-width' | 'medium';

  // Layout options
  spacing?: 'sm' | 'md' | 'lg';
  topPadding?: '0' | '4' | '6' | '8';

  // Control padding behavior
  contentPadding?: boolean;

  // Custom classes for main section
  mainClassName?: string;
}

/**
 * PageLayout - Unified layout component combining width constraints and page structure
 *
 * @param variant - Width variant:
 *   - 'narrow' (max-w-4xl) - For landing pages, auth forms
 *   - 'default' (max-w-6xl) - For general content
 *   - 'medium' (max-w-5xl)
 *   - 'full-width' - For edge-to-edge layouts
 *
 * @param header - Optional header content
 * @param footer - Optional footer content (e.g., AudioPlayer)
 * @param children - Main content area
 *
 * @param spacing - Gap between sections: 'sm' | 'md' | 'lg' (default: 'lg')
 * @param topPadding - Top padding: '0' | '4' | '6' | '8' (default: '8')
 *
 * @param contentPadding - Apply horizontal padding to main content (default: true)
 * @param headerPadding - Apply horizontal padding to header (default: true)
 * @param footerPadding - Apply horizontal padding to footer (default: false)
 *
 * @example Basic usage
 * <PageLayout variant="default">
 *   <DashboardContent />
 * </PageLayout>
 *
 * @example With header and footer
 * <PageLayout
 *   variant="default"
 *   header={<DashboardPageHeader title="Dashboard" />}
 *   footer={<AudioPlayer />}
 *   footerPadding={false}
 * >
 *   <TranscriptionViewer />
 * </PageLayout>
 */
export const PageLayout = ({
  header,
  footer,
  children,
  variant = 'default',
  spacing = 'lg',
  topPadding = '6',
  contentPadding = true,
  mainClassName,
}: PageLayoutProps) => {
  // Container classes - these already include padding!
  const containerClass = {
    'default': 'container-max-w-6xl',
    'medium': 'container-max-w-5xl',
    'narrow': 'container-max-w-4xl',
    'full-width': 'container-full-width',
  }[variant];

  // Spacing classes - responsive
  const spacingClass = {
    sm: 'gap-2 md:gap-4',
    md: 'gap-4 md:gap-6',
    lg: 'gap-6 md:gap-8',
  }[spacing];

  // Top padding classes - responsive
  const topPaddingClass = {
    0: '',
    4: 'pt-2 md:pt-4',
    6: 'pt-4 md:pt-6',
    8: 'pt-6 md:pt-8',
  }[topPadding];

  return (
    <div className={cn('flex flex-col min-h-svh', spacingClass, topPaddingClass)}>
      {header}

      <main className={cn('flex-1', contentPadding && containerClass, mainClassName)}>
        {children}
      </main>

      {footer}
    </div>
  );
};
