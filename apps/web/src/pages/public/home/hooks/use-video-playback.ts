import { useRef, useState } from 'react';

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
  slug: string;
  videoLoaded: boolean;
  hasVideo: boolean;
}

export function useVideoPlayback({ slug, videoLoaded, hasVideo }: UseVideoPlaybackOptions) {
  const [isHovered, setIsHovered] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  // 50% of cards autoplay, deterministic based on slug
  const shouldAutoplay = hashCode(slug) % 2 === 0;

  // Video should show when: video exists AND loaded AND (autoplay OR hover)
  const shouldShowVideo = hasVideo && videoLoaded && (shouldAutoplay || isHovered);

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
    videoRef,
    shouldAutoplay,
    shouldShowVideo,
    handleCardMouseEnter,
    handleCardMouseLeave,
  };
}
