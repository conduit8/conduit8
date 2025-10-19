import { Link } from '@tanstack/react-router';
import { cn } from '@web/lib/utils';
import { memo } from 'react';

// Size mappings
const sizeConfig = {
  sm: {
    icon: 'h-5 w-5',
    text: 'text-xl',
    gap: 'gap-1.5',
  },
  md: {
    icon: 'h-7 w-7',
    text: 'text-3xl',
    gap: 'gap-2',
  },
  lg: {
    icon: 'h-9 w-9',
    text: 'text-4xl',
    gap: 'gap-2.5',
  },
};

interface LogoIconProps {
  size: string;
  interactive?: boolean;
}

const LogoIcon = memo(({ size, interactive = true }: LogoIconProps) => {
  return (
    <div
      className={cn(
        size,
        'relative flex items-center justify-center rounded',
        interactive && [
          'cursor-pointer',
          'transition-opacity duration-200',
          'hover:opacity-90',
        ],
      )}
    >
      <span className="font-brand font-bold text-2xl tracking-tighter leading-none">
        <span className="text-accent">[</span>
        <span className="text-foreground">C8</span>
        <span className="text-accent">]</span>
      </span>
    </div>
  );
});
LogoIcon.displayName = 'LogoIcon';

interface LogoTextProps {
  textSize: string;
}

const LogoText = memo(({ textSize }: LogoTextProps) => (
  <span className={cn('font-brand font-bold tracking-wide', textSize)}>
    conduit8
  </span>
));
LogoText.displayName = 'LogoText';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'icon' | 'text';
  className?: string;
  interactive?: boolean;
  href?: string;
}

export const Logo = ({
  size = 'md',
  variant = 'default',
  className,
  interactive = true,
  href = '/',
}: LogoProps) => {
  const config = sizeConfig[size];
  const showIcon = variant === 'default' || variant === 'icon';
  const showText = variant === 'default' || variant === 'text';

  return (
    <Link to={href} className="hover:no-underline">
      <div className={cn('inline-flex items-center', config.gap, className)}>
        {showIcon && <LogoIcon size={config.icon} interactive={interactive} />}
        {showText && <LogoText textSize={config.text} />}
      </div>
    </Link>
  );
};
