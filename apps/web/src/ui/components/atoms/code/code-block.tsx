import { CheckIcon, CopyIcon } from '@phosphor-icons/react';
import { Highlight, themes } from 'prism-react-renderer';
import { useState } from 'react';

import { cn } from '@web/lib/utils/tailwind-utils';

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
export function CodeBlock({
  code,
  language = 'bash',
  showCopyButton = true,
  className,
}: CodeBlockProps) {
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
              className={cn(
                'bg-gray-12 border border-border overflow-x-auto rounded-lg p-6 font-mono text-base',
              )}
              style={customStyle}
            >
              {tokens.map((line) => {
                const lineContent = line.map(t => t.content).join('');
                const lineHash = lineContent
                  .split('')
                  .reduce((acc, char) => acc + char.charCodeAt(0), 0);
                return (
                  <div
                    key={`line-${lineHash}-${lineContent.slice(0, 30)}`}
                    {...getLineProps({ line })}
                  >
                    {line.map((token) => {
                      const tokenHash = token.content
                        .split('')
                        .reduce((acc, char) => acc + char.charCodeAt(0), 0);
                      return (
                        <span
                          key={`token-${tokenHash}-${token.content.slice(0, 20)}`}
                          {...getTokenProps({ token })}
                        />
                      );
                    })}
                  </div>
                );
              })}
            </pre>
          );
        }}
      </Highlight>

      {showCopyButton && (
        <button
          type="button"
          onClick={copyToClipboard}
          className="bg-background/80 hover:bg-background text-muted-foreground hover:text-foreground absolute right-3 top-3 rounded-md p-1.5 transition-colors"
          aria-label="Copy code"
        >
          {copied
            ? (
                <CheckIcon size={16} weight="bold" className="text-accent" />
              )
            : (
                <CopyIcon size={16} />
              )}
        </button>
      )}
    </div>
  );
}
