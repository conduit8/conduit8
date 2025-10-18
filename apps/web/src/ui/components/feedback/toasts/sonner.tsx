import {
  CheckCircleIcon,
  CircleNotchIcon,
  InfoIcon,
  WarningIcon,
  XCircleIcon,
  XIcon,
} from '@phosphor-icons/react';
import { useTheme } from 'next-themes';

import type { ToasterProps } from 'sonner';

import { Toaster as Sonner } from 'sonner';

function Toaster({ ...props }: ToasterProps) {
  const { theme = 'system' } = useTheme();

  return (
    <Sonner
      theme={theme as ToasterProps['theme']}
      className="toaster group"
      style={
        {
          '--normal-bg': 'var(--surface)',
          '--normal-text': 'var(--muted-foreground)',
          '--normal-border': 'var(--border)',
        } as React.CSSProperties
      }
      toastOptions={{
        classNames: {
          toast: 'font-sans',
          title: 'font-medium text-[var(--foreground)]',
          description: '!text-[var(--muted-foreground)]',
        },
      }}
      icons={{
        success: <CheckCircleIcon weight="duotone" className="size-5 text-success-muted-foreground" />,
        error: <XCircleIcon weight="duotone" className="size-5 text-destructive-muted-foreground" />,
        warning: <WarningIcon weight="duotone" className="size-5 text-warning-muted-foreground" />,
        info: <InfoIcon weight="duotone" className="size-5 text-muted-foreground" />,
        loading: <CircleNotchIcon className="size-5 animate-spin" />,
        close: <XIcon weight="bold" className="size-4" />,
      }}
      {...props}
    />
  );
}

export { Toaster };
