import { ArrowCircleDownIcon, CheckIcon, DownloadSimpleIcon } from '@phosphor-icons/react';
import { useState } from 'react';
import { toast } from 'sonner';

import { Button } from '@web/ui/components/atoms/buttons/button';
import { Badge } from '@web/ui/components/atoms/indicators/badge';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@web/ui/components/layout/containers/card';
import { Tooltip, TooltipContent, TooltipTrigger } from '@web/ui/components/overlays/tooltip';

interface SkillCardProps {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  downloadCount: number;
  author: string;
  authorKind: 'verified' | 'community';
  onClick: () => void;
}

export function SkillCard({
  id,
  name,
  description,
  imageUrl,
  downloadCount,
  author,
  authorKind,
  onClick,
}: SkillCardProps) {
  const [isCopied, setIsCopied] = useState(false);
  const installCommand = `npx @conduit8/cli install ${id}`;

  const handleInstallClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent card click
    navigator.clipboard.writeText(installCommand);
    setIsCopied(true);
    toast.success('Install command copied', {
      description: (
        <span className="font-semibold font-mono">{installCommand}</span>
      ),
    });

    // Reset copied state after 2 seconds
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <Card
      className="cursor-pointer transition-all hover:border-border-interactive overflow-hidden p-0 flex flex-col h-full"
      onClick={onClick}
    >
      {/* Image */}
      <div className="aspect-video w-full overflow-hidden shrink-0">
        <img
          src={imageUrl}
          alt={name}
          className="h-full w-full object-cover"
        />
      </div>

      {/* Content - fixed structure */}
      <div className="p-6 flex flex-col gap-4 text-left flex-1">
        {/* Title + Description */}
        <CardHeader className="p-0 flex-1">
          <div className="flex items-center justify-between gap-2 mb-2">
            <CardTitle className="font-semibold">{name}</CardTitle>
            {author === 'anthropic' && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <Badge variant="info" className="text-xs shrink-0">
                    Official
                  </Badge>
                </TooltipTrigger>
                <TooltipContent>
                  Created by
                  {' '}
                  <strong>Anthropic</strong>
                </TooltipContent>
              </Tooltip>
            )}
          </div>
          <CardDescription className="line-clamp-3">
            {description}
          </CardDescription>
        </CardHeader>

        {/* Footer: Stats + Actions */}
        <CardContent className="p-0 flex items-center justify-between gap-3 mt-auto">
          {/* Stats/Badges */}
          <Tooltip>
            <TooltipTrigger asChild>
              <div>
                <Badge variant="neutral" className="gap-1.5">
                  <DownloadSimpleIcon size={12} />
                  {downloadCount.toLocaleString()}
                </Badge>
              </div>
            </TooltipTrigger>
            <TooltipContent>
              Total installs
            </TooltipContent>
          </Tooltip>

          {/* Actions */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleInstallClick}
                className="shrink-0"
              >
                {isCopied
                  ? <CheckIcon size={16} weight="bold" className="text-accent" />
                  : <ArrowCircleDownIcon size={16} weight="duotone" className="text-accent" />}
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <code className="bg-muted px-1.5 py-0.5 rounded">{installCommand}</code>
            </TooltipContent>
          </Tooltip>
        </CardContent>
      </div>
    </Card>
  );
}
