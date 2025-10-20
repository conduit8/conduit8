import { CheckIcon, SealCheckIcon, UsersIcon } from '@phosphor-icons/react';
import { useState } from 'react';
import { toast } from 'sonner';

import { ArrowDownIcon } from '@web/ui/components/animate-ui/icons/arrow-down';
import { DownloadIcon } from '@web/ui/components/animate-ui/icons/download';
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
  slug: string;
  name: string;
  description: string;
  imageUrl: string;
  downloadCount: number;
  author: string;
  authorKind: 'verified' | 'community';
  onClick: () => void;
}

export function SkillCard({
  slug,
  name,
  description,
  imageUrl,
  downloadCount,
  author,
  authorKind,
  onClick,
}: SkillCardProps) {
  const [isCopied, setIsCopied] = useState(false);
  const [downloadBadgeHovered, setDownloadBadgeHovered] = useState(false);
  const [installButtonHovered, setInstallButtonHovered] = useState(false);
  const installCommand = `npx conduit8 install skill ${slug}`;

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
      className="cursor-pointer transition-all duration-200 outline outline-1 outline-border hover:outline-2 hover:outline-accent hover:-translate-y-1 hover:shadow-lg overflow-hidden p-0 flex flex-col h-full border-0"
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
              <Badge
                variant="neutral"
                className="gap-1.5"
                onMouseEnter={() => setDownloadBadgeHovered(true)}
                onMouseLeave={() => setDownloadBadgeHovered(false)}
              >
                <ArrowDownIcon size={12} animate={downloadBadgeHovered} />
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
          onMouseEnter={() => setInstallButtonHovered(true)}
          onMouseLeave={() => setInstallButtonHovered(false)}
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
                  <DownloadIcon size={16} animate={installButtonHovered} />
                  Install
                </>
              )}
        </Button>
      </div>
    </Card>
  );
}
