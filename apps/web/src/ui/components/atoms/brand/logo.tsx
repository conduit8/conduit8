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
    <svg
      viewBox="-1 0 10 10"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      shapeRendering="crispEdges"
      className={cn(
        size,
        'rounded',
        interactive && [
          'cursor-pointer',
          'transition-opacity duration-200',
          'hover:opacity-90',
        ],
      )}
    >
      <rect x="-1" y="0" width="10" height="10" rx="0.8" fill="currentColor" className="text-foreground" />
      <rect x="-0.01" y="-0.01" width="1.02" height="1.02" fill="currentColor" className="text-background" />
      <rect x="0.99" y="-0.01" width="1.02" height="1.02" fill="currentColor" className="text-background" />
      <rect x="5.99" y="-0.01" width="1.02" height="1.02" fill="currentColor" className="text-background" />
      <rect x="6.99" y="-0.01" width="1.02" height="1.02" fill="currentColor" className="text-background" />
      <rect x="-0.01" y="0.99" width="1.02" height="1.02" fill="currentColor" className="text-background" />
      <rect x="0.99" y="0.99" width="1.02" height="1.02" fill="currentColor" className="text-background" />
      <rect x="5.99" y="0.99" width="1.02" height="1.02" fill="currentColor" className="text-background" />
      <rect x="6.99" y="0.99" width="1.02" height="1.02" fill="currentColor" className="text-background" />
      <rect x="-0.01" y="1.99" width="1.02" height="1.02" fill="currentColor" className="text-background" />
      <rect x="0.99" y="1.99" width="1.02" height="1.02" fill="currentColor" className="text-background" />
      <rect x="3.99" y="1.99" width="1.02" height="1.02" fill="currentColor" className="text-background" />
      <rect x="4.99" y="1.99" width="1.02" height="1.02" fill="currentColor" className="text-background" />
      <rect x="-0.01" y="2.99" width="1.02" height="1.02" fill="currentColor" className="text-background" />
      <rect x="0.99" y="2.99" width="1.02" height="1.02" fill="currentColor" className="text-background" />
      <rect x="3.99" y="2.99" width="1.02" height="1.02" fill="currentColor" className="text-background" />
      <rect x="4.99" y="2.99" width="1.02" height="1.02" fill="currentColor" className="text-background" />
      <rect x="-0.01" y="3.99" width="1.02" height="1.02" fill="currentColor" className="text-background" />
      <rect x="0.99" y="3.99" width="1.02" height="1.02" fill="currentColor" className="text-background" />
      <rect x="1.99" y="3.99" width="1.02" height="1.02" fill="currentColor" className="text-background" />
      <rect x="2.99" y="3.99" width="1.02" height="1.02" fill="currentColor" className="text-background" />
      <rect x="-0.01" y="4.99" width="1.02" height="1.02" fill="currentColor" className="text-background" />
      <rect x="0.99" y="4.99" width="1.02" height="1.02" fill="currentColor" className="text-background" />
      <rect x="1.99" y="4.99" width="1.02" height="1.02" fill="currentColor" className="text-background" />
      <rect x="2.99" y="4.99" width="1.02" height="1.02" fill="currentColor" className="text-background" />
      <rect x="-0.01" y="5.99" width="1.02" height="1.02" fill="currentColor" className="text-background" />
      <rect x="0.99" y="5.99" width="1.02" height="1.02" fill="currentColor" className="text-background" />
      <rect x="3.99" y="5.99" width="1.02" height="1.02" fill="currentColor" className="text-background" />
      <rect x="4.99" y="5.99" width="1.02" height="1.02" fill="currentColor" className="text-background" />
      <rect x="-0.01" y="6.99" width="1.02" height="1.02" fill="currentColor" className="text-background" />
      <rect x="0.99" y="6.99" width="1.02" height="1.02" fill="currentColor" className="text-background" />
      <rect x="3.99" y="6.99" width="1.02" height="1.02" fill="currentColor" className="text-background" />
      <rect x="4.99" y="6.99" width="1.02" height="1.02" fill="currentColor" className="text-background" />
      <rect x="-0.01" y="7.99" width="1.02" height="1.02" fill="currentColor" className="text-background" />
      <rect x="0.99" y="7.99" width="1.02" height="1.02" fill="currentColor" className="text-background" />
      <rect x="5.99" y="7.99" width="1.02" height="1.02" fill="currentColor" className="text-background" />
      <rect x="6.99" y="7.99" width="1.02" height="1.02" fill="currentColor" className="text-background" />
      <rect x="-0.01" y="8.99" width="1.02" height="1.02" fill="currentColor" className="text-background" />
      <rect x="0.99" y="8.99" width="1.02" height="1.02" fill="currentColor" className="text-background" />
      <rect x="5.99" y="8.99" width="1.02" height="1.02" fill="currentColor" className="text-background" />
      <rect x="6.99" y="8.99" width="1.02" height="1.02" fill="currentColor" className="text-background" />
    </svg>
  );
});
LogoIcon.displayName = 'LogoIcon';

interface LogoTextProps {
  textSize: string;
}

const LogoText = memo(({ textSize }: LogoTextProps) => (
  <span className={cn('font-brand font-bold tracking-wide', textSize)}>
    Conduit8
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
