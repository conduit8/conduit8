// TODO: This component is not currently used but kept for future implementation
// Requires prism-react-renderer package to be installed
// Uncomment when code highlighting is needed

/*
import { Check, Copy } from '@phosphor-icons/react';
import { Highlight, themes } from 'prism-react-renderer';
import { useState } from 'react';

import { cn } from '@web/shared/utils/tailwind-utils.ts';

export interface CodeBlockProps {
  code: string;
  language?: string;
  showCopyButton?: boolean;
  className?: string;
}

/**
 * CodeBlock component for displaying formatted code with syntax highlighting
 * and copy functionality.
 */
/*
export const CodeBlock = ({
  code,
  language = 'bash',
  showCopyButton = true,
  className,
}: CodeBlockProps): JSX.Element => {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = (): void => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={cn('relative', className)}>
      <Highlight theme={themes.oneDark} code={code} language={language}>
        {({ style, tokens, getLineProps, getTokenProps }) => {
          // Create a new style object without the background
          const customStyle = { ...style };
          delete customStyle.backgroundColor;

          return (
            <pre
              className={cn('bg-muted overflow-x-auto rounded-md p-3 font-mono text-sm')}
              style={customStyle}
            >
              {tokens.map((line, i) => (
                <div key={i} {...getLineProps({ line })}>
                  {line.map((token, key) => (
                    <span key={key} {...getTokenProps({ token })} />
                  ))}
                </div>
              ))}
            </pre>
          );
        }}
      </Highlight>

      {showCopyButton && (
        <button
          onClick={copyToClipboard}
          className="bg-background/80 hover:bg-background text-muted-foreground hover:text-foreground absolute right-2 top-2 rounded-md p-1.5 transition-colors"
          aria-label="Copy code"
        >
          {copied ? <Check size={16} /> : <Copy size={16} />}
        </button>
      )}
    </div>
  );
};
*/

// Temporary export to prevent import errors
export const CodeBlock = () => null;
