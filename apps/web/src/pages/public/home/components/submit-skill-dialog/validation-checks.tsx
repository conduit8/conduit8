import { CheckCircleIcon, CircleNotchIcon, XCircleIcon } from '@phosphor-icons/react';

export type ValidationState = 'checking' | 'success' | 'error';

export interface ValidationCheck {
  label: string;
  state: ValidationState;
  errorMessage?: string;
}

interface ValidationChecksProps {
  checks: ValidationCheck[];
}

export function ValidationChecks({ checks }: ValidationChecksProps) {
  return (
    <div className="flex flex-col gap-2">
      {checks.map(check => (
        <div key={check.label} className="flex items-center gap-2">
          {/* Icon */}
          {check.state === 'checking' && (
            <CircleNotchIcon className="size-4 text-muted-foreground animate-spin" />
          )}
          {check.state === 'success' && (
            <CheckCircleIcon weight="duotone" className="size-4 text-success-muted-foreground" />
          )}
          {check.state === 'error' && (
            <XCircleIcon weight="duotone" className="size-4 text-destructive-muted-foreground" />
          )}

          {/* Label and error */}
          <div className="flex-1 min-w-0">
            <p className={`text-sm ${check.state === 'error' ? 'text-destructive' : 'text-foreground'}`}>
              {check.label}
            </p>
            {check.state === 'error' && check.errorMessage && (
              <p className="text-xs text-destructive mt-0.5">
                {check.errorMessage}
              </p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
