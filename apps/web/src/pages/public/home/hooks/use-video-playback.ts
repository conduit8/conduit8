import type { RefObject } from 'react';

import { useState } from 'react';

// Deterministic hash: same slug = same autoplay decision
function hashCode(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) - hash) + str.charCodeAt(i);
    hash = hash & hash; // Convert to 32bit integer
  }
  return Math.abs(hash);
}

interface UseVideoPlaybackOptions {
  videoRef: RefObject<HTMLVideoElement | null>;
  slug: string;
  videoLoaded: boolean;
  hasVideo: boolean;
  isInViewport: boolean;
}

export function useVideoPlayback({ videoRef, slug, videoLoaded, hasVideo, isInViewport }: UseVideoPlaybackOptions) {
  const [isHovered, setIsHovered] = useState(false);

  // 50% of cards autoplay, deterministic based on slug
  const shouldAutoplay = hashCode(slug) % 2 === 0;

  // Video ready to display?
  const videoReady = hasVideo && videoLoaded;

  // Should we play it?
  const canAutoplay = shouldAutoplay && isInViewport;
  const shouldPlay = canAutoplay || isHovered;

  // Final decision
  const shouldShowVideo = videoReady && shouldPlay;

  const handleCardMouseEnter = () => {
    setIsHovered(true);
    if (videoRef.current && videoLoaded) {
      // Play video on hover (for non-autoplay cards)
      if (!shouldAutoplay) {
        videoRef.current.play();
      }
      // Slow down all videos to 75% on hover
      videoRef.current.playbackRate = 0.75;
    }
  };

  const handleCardMouseLeave = () => {
    setIsHovered(false);
    // Pause video on leave (for non-autoplay cards)
    if (videoRef.current && !shouldAutoplay) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0; // Reset to start
    }
    // Restore normal speed
    if (videoRef.current && shouldAutoplay) {
      videoRef.current.playbackRate = 1.0;
    }
  };

  return {
    shouldAutoplay,
    shouldShowVideo,
    handleCardMouseEnter,
    handleCardMouseLeave,
  };
}
