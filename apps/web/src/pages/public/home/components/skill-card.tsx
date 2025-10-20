import { ArrowCircleDownIcon, CheckIcon, DownloadSimpleIcon, SealCheckIcon, UsersIcon } from '@phosphor-icons/react';
import { useState } from 'react';
import { toast } from 'sonner';

import { Button } from '@web/ui/components/atoms/buttons/button';
import { Badge } from '@web/ui/components/atoms/indicators/badge';
import {
  Card,
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

      {/* Content */}
      <div className="p-4 flex flex-col gap-3 text-left flex-1">
        {/* Title + Description */}
        <CardHeader className="p-0 space-y-1.5">
          <CardTitle className="text-base font-semibold">{name}</CardTitle>
          <CardDescription className="line-clamp-2 text-sm">
            {description}
          </CardDescription>
        </CardHeader>

        {/* Metadata Row */}
        <div className="flex items-center gap-2 flex-wrap">
          <Tooltip>
            <TooltipTrigger asChild>
              <Badge variant="neutral" className="gap-1.5">
                {authorKind === 'verified'
                  ? <SealCheckIcon size={12} />
                  : <UsersIcon size={12} />}
                {authorKind === 'verified' ? 'Verified' : 'Community'}
              </Badge>
            </TooltipTrigger>
            <TooltipContent>
              Created by
              {' '}
              {author}
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Badge variant="neutral" className="gap-1.5">
                <DownloadSimpleIcon size={12} />
                {downloadCount.toLocaleString()}
              </Badge>
            </TooltipTrigger>
            <TooltipContent>
              Total installs
            </TooltipContent>
          </Tooltip>
        </div>

        {/* Action Row */}
        <Button
          variant="outline"
          size="sm"
          onClick={handleInstallClick}
          className="w-full justify-center gap-2"
        >
          {isCopied
            ? (
                <>
                  <CheckIcon size={16} weight="bold" />
                  Copied!
                </>
              )
            : (
                <>
                  <ArrowCircleDownIcon size={16} />
                  Install
                </>
              )}
        </Button>
      </div>
    </Card>
  );
}
