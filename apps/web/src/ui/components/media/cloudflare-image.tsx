// TODO: This component is not currently used but kept for future implementation
// Requires config.cloudflareImages to be added with accountHash and defaultVariant
// Uncomment when Cloudflare Images is set up

/*
import React, { useState } from 'react';

import { Skeleton } from '@web/components/ui/feedback/progress/skeleton.tsx';
import { config } from '@web/config/config.ts';
import { logger } from '@web/shared/lib/logger';
import { cn } from '@web/shared/utils/tailwind-utils.ts';

export interface CloudflareImageProps {
  // Cloudflare Image ID (required)
  imageId: string;
  // Alt text for the image
  alt: string;
  // Optional variant/transformation to apply
  variant?: string;
  // Whether the image should be clickable to open in a new tab
  enlargeable?: boolean;
  // Additional CSS classes for the image
  className?: string;
  // CSS classes for the container
  containerClassName?: string;
}

/**
 * CloudflareImage component for displaying images from Cloudflare Images
 *
 * This component displays images hosted on Cloudflare Images using their IDs,
 * with optional enlarging functionality by opening in a new tab.
 */
/*
export const CloudflareImage: React.FC<CloudflareImageProps> = ({
  imageId,
  alt,
  variant = config.cloudflareImages.defaultVariant,
  enlargeable = false,
  className,
  containerClassName,
}): JSX.Element | null => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  if (!imageId) {
    console.error('CloudflareImage: imageId is required');
    return null;
  }

  // Construct Cloudflare image URL using config
  // Format: https://imagedelivery.net/<account_hash>/<image_id>/<variant>
  const imageSrc = `https://imagedelivery.net/${config.cloudflareImages.accountHash}/${imageId}/${variant}`;

  const handleImageLoad = (): void => {
    setIsLoading(false);
  };

  const handleImageError = (): void => {
    setIsLoading(false);
    setHasError(true);
    logger.error(`Failed to load Cloudflare image with ID: ${imageId}`);
    logger.error(`URL attempted: ${imageSrc}`);
  };

  // Image element with loading and error handling
  const imageElement = (
    <>
      {isLoading && <Skeleton className={cn('absolute inset-0 h-full w-full', className)} />}
      {!hasError && (
        <img
          src={imageSrc}
          alt={alt}
          className={cn('h-auto w-full object-contain', isLoading && 'opacity-0', className)}
          onLoad={handleImageLoad}
          onError={handleImageError}
        />
      )}
      {hasError && (
        <div className="text-destructive bg-destructive-accent w-full rounded-md p-4 text-center">
          Failed to load image
        </div>
      )}
    </>
  );

  // Container with proper positioning for skeleton
  const containerElement = <div className={cn('relative', containerClassName)}>{imageElement}</div>;

  // If enlargeable, wrap in an anchor tag that opens in a new tab
  if (enlargeable) {
    return (
      <a
        href={imageSrc}
        target="_blank"
        rel="noopener noreferrer"
        className={cn('block cursor-pointer hover:opacity-90')}
        title={`View larger ${alt}`}
      >
        {containerElement}
      </a>
    );
  }

  // Otherwise, just return the container
  return containerElement;
};

export default CloudflareImage;
*/

// Temporary export to prevent import errors
export default {};
