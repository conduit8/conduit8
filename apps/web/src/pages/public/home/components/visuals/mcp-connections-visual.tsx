import { Icon } from '@iconify/react';
import mcpLogo from '@web/assets/mcp-logo.svg';
import { cn } from '@web/lib/utils';
import { useState } from 'react';

export function McpConnectionsVisual() {
  const [isHovered, setIsHovered] = useState(false);

  const tools = [
    { icon: 'mdi:fire', name: 'Firecrawl', opacity: 100, delay: '0ms' },
    { icon: 'mdi:github', name: 'GitHub', opacity: 80, delay: '50ms' },
    { icon: 'simple-icons:linear', name: 'Linear', opacity: 60, delay: '100ms' },
    { icon: 'simple-icons:notion', name: 'Notion', opacity: 40, delay: '150ms' },
    { icon: 'simple-icons:figma', name: 'Figma', opacity: 30, delay: '200ms' },
  ];

  return (
    <div
      className="relative flex h-56 flex-col items-center justify-center p-4"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* MCP Content */}
      <div className="flex flex-col items-center justify-center gap-4">
        {/* MCP Logo */}
        <img
          src={mcpLogo}
          alt="MCP"
          className={cn(
            'h-12 w-12',
            'transition-all duration-300',
            isHovered && 'scale-110',
          )}
        />

        {/* Label */}
        <p className="text-xs text-muted-foreground">Connect any tool via MCP</p>

        {/* Tool icons that appear on hover */}
        <div
          className={cn(
            'flex gap-3 items-center justify-center transition-all duration-500',
            isHovered ? 'opacity-100' : 'opacity-0',
          )}
        >
          {tools.map(tool => (
            <Icon
              key={tool.name}
              icon={tool.icon}
              className="h-5 w-5 transition-all duration-300"
              style={{
                opacity: isHovered ? tool.opacity / 100 : 0,
                transitionDelay: isHovered ? tool.delay : '0ms',
                transform: isHovered ? 'translateY(0)' : 'translateY(4px)',
              }}
            />
          ))}
        </div>

        {/* More coming soon text on hover */}
        <p className={cn(
          'text-[10px] text-muted-foreground transition-all duration-300',
          isHovered ? 'opacity-60' : 'opacity-0',
        )}
        >
          More coming soon
        </p>
      </div>
    </div>
  );
}
