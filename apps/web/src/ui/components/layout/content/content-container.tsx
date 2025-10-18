import { cn } from '@web/lib/utils';

interface BaseContainerProps {
  children: React.ReactNode;
  variant?: 'default' | 'narrow' | 'full-width' | 'medium';
  className?: string;
}

/**
 * BaseContainer - Provides consistent width constraints and centering
 *
 * @param variant - Width variant:
 *   - 'narrow' (max-w-4xl) - For landing pages, auth forms
 *   - 'default' (max-w-6xl) - For general content
 *   - 'medium' (max-w-5xl)
 *   - 'full-width' - For edge-to-edge layouts
 *
 * @example
 * <BaseContainer variant="narrow">
 *   <LoginForm />
 * </BaseContainer>
 *
 * @example Dashboard usage
 * <BaseContainer variant="default">
 *   <DashboardContent />
 * </BaseContainer>
 */
export const BaseContainer = ({ children, variant = 'default', className }: BaseContainerProps) => {
  const containerClass = {
    'default': 'container-max-w-6xl',
    'medium': 'container-max-w-5xl',
    'narrow': 'container-max-w-4xl',
    'full-width': 'container-full-width',
  }[variant];

  return <div className={cn(containerClass, className)}>{children}</div>;
};
