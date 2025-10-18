import { Icon } from '@iconify/react';
import { cn } from '@web/lib/utils';

interface FlagProps {
  countryCode: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

const sizeMap = {
  sm: 16,
  md: 20,
  lg: 24,
};
//
// // Preload all flag icons at module load time
// const flagIcons = LANGUAGE_OPTIONS.map((lang) => `circle-flags:${lang.countryCode.toLowerCase()}`);
// loadIcons(flagIcons);

export function Flag({ countryCode, className, size = 'md' }: FlagProps) {
  const iconSize = sizeMap[size];
  const iconCode = countryCode.toLowerCase();

  return (
    <Icon
      icon={`circle-flags:${iconCode}`}
      width={iconSize}
      height={iconSize}
      className={cn('inline-block', className)}
    />
  );
}
