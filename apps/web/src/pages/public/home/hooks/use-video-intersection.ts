import type { RefObject } from 'react';

import { useEffect, useState } from 'react';

interface UseVideoIntersectionOptions {
  videoRef: RefObject<HTMLVideoElement | null>;
  threshold?: number;
  rootMargin?: string;
}

/**
 * Hook to detect when a video element enters viewport and trigger lazy loading
 * Uses web.dev pattern: swaps data-src → src and calls video.load()
 */
export function useVideoIntersection({
  videoRef,
  threshold = 0.25,
  rootMargin = '0px',
}: UseVideoIntersectionOptions) {
  const [isInViewport, setIsInViewport] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video)
      return;

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry?.isIntersecting) {
          setIsInViewport(true);

          // Trigger lazy load: data-src → src + video.load()
          const source = video.querySelector('source');
          if (source?.dataset.src && !source.src) {
            source.src = source.dataset.src;
            video.load();
          }

          // Once loaded, stop observing
          observer.disconnect();
        }
      },
      {
        threshold,
        rootMargin,
      }
    );

    observer.observe(video);

    return () => {
      observer.disconnect();
    };
  }, [videoRef, threshold, rootMargin]);

  return {
    isInViewport,
  };
}
