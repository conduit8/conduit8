import { cn } from '@web/lib/utils/tailwind-utils';

interface DividerProps {
  text?: string;
  className?: string;
}

const Divider = ({ text, className }: DividerProps & {}) => {
  return (
    <div className={cn('relative my-6', className)}>
      <div className="absolute inset-0 flex items-center">
        <span className="border-border w-full border-t"></span>
      </div>
      {text && (
        <div className="relative flex justify-center text-sm">
          <span className="bg-background text-muted-foreground px-2">{text}</span>
        </div>
      )}
    </div>
  );
};
Divider.displayName = 'Divider';

export { Divider };
