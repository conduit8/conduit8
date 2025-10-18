import { Switch as SwitchPrimitives } from 'radix-ui';
import * as React from 'react';

import { cn } from '@web/lib/utils/tailwind-utils';

const Switch = ({
  ref,
  className,
  ...props
}: React.ComponentPropsWithoutRef<typeof SwitchPrimitives.Root> & {
  ref: React.RefObject<React.ElementRef<typeof SwitchPrimitives.Root>>;
}) => (
  <SwitchPrimitives.Root
    className={cn(
      'peer inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border-2'
      + ' focus-visible:outline-hidden border-transparent transition-colors focus-visible:ring-2'
      + ' focus-visible:ring-ring focus-visible:ring-offset-2'
      + ' focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50'
      + ' data-[state=checked]:bg-accent data-[state=unchecked]:bg-secondary',
      className,
    )}
    {...props}
    ref={ref}
  >
    <SwitchPrimitives.Thumb
      className={cn(
        'bg-background pointer-events-none block h-5 w-5 rounded-full shadow-lg ring-0 transition-transform data-[state=checked]:translate-x-5 data-[state=unchecked]:translate-x-0',
      )}
    />
  </SwitchPrimitives.Root>
);
Switch.displayName = SwitchPrimitives.Root.displayName;

export { Switch };
