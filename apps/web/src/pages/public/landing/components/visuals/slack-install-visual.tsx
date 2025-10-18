import { Icon } from '@iconify/react';
import { cn } from '@web/lib/utils';
import { useState } from 'react';
import { PiCursorFill } from 'react-icons/pi';

export function SlackInstallVisual() {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className="relative flex h-56 flex-col items-center justify-center p-4"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Slack workspace mockup background */}
      <div className="absolute inset-0 flex flex-col opacity-10">
        <div className="border-b border-muted-foreground/20 p-2">
          <div className="h-2 w-16 bg-muted-foreground/30 rounded" />
        </div>
        <div className="flex flex-1">
          <div className="w-16 border-r border-muted-foreground/20 p-2">
            <div className="space-y-2">
              <div className="h-2 w-full bg-muted-foreground/30 rounded" />
              <div className="h-2 w-full bg-muted-foreground/30 rounded" />
              <div className="h-2 w-full bg-muted-foreground/30 rounded" />
            </div>
          </div>
          <div className="flex-1 p-4">
            <div className="space-y-2">
              <div className="h-2 w-32 bg-muted-foreground/30 rounded" />
              <div className="h-2 w-24 bg-muted-foreground/30 rounded" />
            </div>
          </div>
        </div>
      </div>

      {/* Add to Slack button */}
      <a
        href="https://slack.com/oauth/v2/authorize?client_id=6959503069491.9140053645266&scope=assistant:write,chat:write,commands,im:history,im:write,incoming-webhook,users.profile:read,users:write,channels:history&user_scope="
        target="_blank"
        rel="noopener noreferrer"
        className={cn(
          'relative z-10 flex items-center gap-2 rounded-lg px-4 py-2.5',
          'bg-white border border-gray-300 shadow-sm',
          'transition-all duration-300',
          isHovered && 'scale-105 shadow-lg',
          'hover:no-underline',
        )}
      >
        <span className="text-sm font-medium text-gray-900">Add to</span>
        <Icon icon="logos:slack-icon" className="h-5 w-5" />
      </a>

      {/* Animated cursor */}
      <div
        className={cn(
          'absolute z-20 transition-all duration-500 ease-out pointer-events-none',
          isHovered
            ? 'bottom-[45%] right-[28%] opacity-100 scale-100'
            : 'bottom-[35%] right-[20%] opacity-0 scale-75',
        )}
      >
        <PiCursorFill className="h-6 w-6 text-gray-800 rotate-0" />
      </div>

      {/* Success message (shows on hover) */}
      <div
        className={cn(
          'absolute bottom-4 left-0 right-0 flex justify-center transition-all duration-500',
          isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2',
        )}
      >
        <div className="flex items-center gap-2 rounded-full bg-green-50 px-3 py-1.5 border border-green-200">
          <div className="h-1.5 w-1.5 rounded-full bg-green-500" />
          <span className="text-xs font-medium text-green-700">Ready to install</span>
        </div>
      </div>
    </div>
  );
}
