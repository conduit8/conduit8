import { CheckIcon, SealCheckIcon, UsersIcon } from '@phosphor-icons/react';
import { useState } from 'react';

import { ArrowDownIcon } from '@web/ui/components/animate-ui/icons/arrow-down';
import { DownloadIcon } from '@web/ui/components/animate-ui/icons/download';
import { Button } from '@web/ui/components/atoms/buttons/button';
import { Badge } from '@web/ui/components/atoms/indicators/badge';
import { Skeleton } from '@web/ui/components/feedback/progress/skeleton';
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@web/ui/components/layout/containers/card';
import { Tooltip, TooltipContent, TooltipTrigger } from '@web/ui/components/overlays/tooltip';

import { useInstallCommand } from '../hooks/use-install-command';
import { useMediaLoading } from '../hooks/use-media-loading';
import { useVideoPlayback } from '../hooks/use-video-playback';

interface SkillCardProps {
  slug: string;
  name: string;
  description: string;
  imageUrl: string;
  videoUrl?: string;
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
  videoUrl,
  downloadCount,
  author,
  authorKind,
  onClick,
}: SkillCardProps) {
  const [downloadBadgeHovered, setDownloadBadgeHovered] = useState(false);
  const [installButtonHovered, setInstallButtonHovered] = useState(false);

  // Custom hooks
  const {
    imageLoaded,
    imageError,
    videoLoaded,
    handleImageLoad,
    handleImageError,
    handleVideoLoad,
    handleVideoError,
  } = useMediaLoading();
  const {
    videoRef,
    shouldAutoplay,
    shouldShowVideo,
    handleCardMouseEnter,
    handleCardMouseLeave,
  } = useVideoPlayback({ slug, videoLoaded, hasVideo: !!videoUrl });
  const { isCopied, handleInstallClick } = useInstallCommand(slug);

  return (
    <Card
      className="cursor-pointer transition-all duration-200 outline-1 outline-border hover:outline-2 hover:outline-accent hover:-translate-y-1 hover:shadow-lg overflow-hidden p-0 flex flex-col h-full border-0"
      onClick={onClick}
      onMouseEnter={handleCardMouseEnter}
      onMouseLeave={handleCardMouseLeave}
    >
      {/* Image/Video */}
      <div className="aspect-video w-full overflow-hidden shrink-0 relative">
        {/* Skeleton: show while image loading and no error */}
        {!imageLoaded && !imageError && (
          <Skeleton className="absolute inset-0 h-full w-full" />
        )}

        {/* Image: render if not errored */}
        {!imageError && (
          <img
            src={imageUrl}
            alt={name}
            onLoad={handleImageLoad}
            onError={handleImageError}
            className={`h-full w-full object-cover ${shouldShowVideo ? 'hidden' : ''
            }`}
          />
        )}

        {/* Fallback: show skill name if image fails */}
        {imageError && !shouldShowVideo && (
          <div className="absolute inset-0 flex items-center justify-center bg-surface text-text">
            <span className="font-mono text-sm px-4 text-center">{name}</span>
          </div>
        )}

        {/* Video: only render if videoUrl exists */}
        {videoUrl && (
          <video
            ref={videoRef}
            src={videoUrl}
            onLoadedData={handleVideoLoad}
            onError={handleVideoError}
            autoPlay={shouldAutoplay}
            loop
            muted
            playsInline
            className={`h-full w-full object-cover ${shouldShowVideo ? '' : 'hidden'
            }`}
          />
        )}
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
