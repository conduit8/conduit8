import { CheckIcon, CopyIcon } from '@phosphor-icons/react';
import { useState } from 'react';
import { toast } from 'sonner';

import { Button } from '@web/ui/components/atoms/buttons/button';

interface CodeShowcaseProps {
  code: string;
  className?: string;
}

export function CodeShowcase({ code, className = '' }: CodeShowcaseProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    toast.success('Copied to clipboard');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={`relative ${className}`}>
      <div className="bg-gray-12 border border-border rounded-lg p-6 relative">
        <pre className="text-base font-mono text-gray-1 overflow-x-auto">
          <code>{code}</code>
        </pre>

        <Button
          variant="ghost"
          size="sm"
          onClick={handleCopy}
          className="absolute top-3 right-3"
        >
          {copied
            ? <CheckIcon size={16} weight="bold" className="text-accent" />
            : <CopyIcon size={16} />}
        </Button>
      </div>
    </div>
  );
}
