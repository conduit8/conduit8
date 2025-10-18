import { cn } from '@web/lib/utils';
import { useEffect, useState } from 'react';

export function SlackToPrVisual() {
  const [isHovered, setIsHovered] = useState(false);
  const [typingProgress, setTypingProgress] = useState(0);

  const kollektivMessage = '✅ PR #1247 created: Fix login authentication bug';
  const kollektivLink = '[github link]';
  const fullReply = `${kollektivMessage}\n${kollektivLink}`;
  const displayReply = fullReply.slice(0, typingProgress);

  useEffect(() => {
    if (!isHovered) {
      setTypingProgress(0);
      return;
    }

    const interval = setInterval(() => {
      setTypingProgress((prev) => {
        if (prev >= fullReply.length)
          return prev;
        return prev + 1;
      });
    }, 40);

    return () => clearInterval(interval);
  }, [isHovered, fullReply.length]);

  return (
    <div
      className="relative flex h-56 flex-col justify-center gap-4 p-4"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Message 1: User */}
      <div className="flex items-start gap-2 w-full">
        <div className="h-5 w-5 rounded bg-info flex items-center justify-center flex-shrink-0">
          <span className="text-white text-[10px] font-bold">U</span>
        </div>
        <div className="flex-1 text-left">
          <div className="flex items-baseline gap-2 mb-0.5">
            <span className="text-xs font-semibold">User</span>
            <span className="text-[10px] text-muted-foreground">10:34 AM</span>
          </div>
          <p className="text-xs text-left">
            <span className="text-muted-foreground font-medium">@kollektiv</span>
            {' '}
            fix the login bug
          </p>
        </div>
      </div>

      {/* Message 2: Kollektiv acknowledgment */}
      <div className="flex items-start gap-2 w-full">
        <div className="h-5 w-5 rounded bg-accent flex items-center justify-center flex-shrink-0">
          <span className="text-accent-foreground text-[10px] font-bold">K</span>
        </div>
        <div className="flex-1 text-left">
          <div className="flex items-baseline gap-2 mb-0.5">
            <span className="text-xs font-semibold">Kollektiv</span>
            <span className="text-[10px] text-muted-foreground">10:34 AM</span>
          </div>
          <p className="text-xs text-left">On it! Let me analyze and fix that for you...</p>
        </div>
      </div>

      {/* Message 3: Kollektiv result (types on hover) */}
      <div
        className={cn(
          'flex items-start gap-2 w-full transition-opacity duration-300',
          isHovered ? 'opacity-100' : 'opacity-0',
        )}
      >
        <div className="h-5 w-5 rounded bg-accent flex items-center justify-center flex-shrink-0">
          <span className="text-accent-foreground text-[10px] font-bold">K</span>
        </div>
        <div className="flex-1 text-left">
          <div className="flex items-baseline gap-2 mb-0.5">
            <span className="text-xs font-semibold">Kollektiv</span>
            <span className="text-[10px] text-muted-foreground">10:44 AM</span>
          </div>
          <div className="text-xs text-left">
            <p className="whitespace-pre-wrap text-xs">
              {displayReply.split('\n')[0]}
              {isHovered && typingProgress < fullReply.length && !displayReply.includes('\n') && (
                <span className="inline-block w-0.5 h-2.5 bg-muted-foreground animate-pulse ml-0.5" />
              )}
            </p>
            {displayReply.includes('\n') && (
              <span className="text-info underline cursor-default block mt-1 text-xs text-left">
                {displayReply.split('\n')[1]}
                {isHovered && typingProgress < fullReply.length && (
                  <span className="inline-block w-0.5 h-2.5 bg-muted-foreground animate-pulse ml-0.5" />
                )}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
