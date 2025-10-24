import { useRef, useState } from 'react';

const MAX_RETRIES = 2;
const NETWORK_ERROR_CODE = 2; // MEDIA_ERR_NETWORK

export function useMediaLoading() {
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const retryCountRef = useRef(0);

  const handleVideoLoad = (event: React.SyntheticEvent<HTMLVideoElement>) => {
    setVideoLoaded(true);
    setHasError(false);
    retryCountRef.current = 0;
  };

  const handleVideoError = (event: React.SyntheticEvent<HTMLVideoElement, Event>) => {
    const video = event.currentTarget;
    const source = video.querySelector('source');

    // Ignore errors when no src is set (initial state before lazy load)
    if (!source?.src) {
      return;
    }

    const errorCode = video.error?.code;

    console.error('[SkillCard] Video ERROR:', {
      src: video.src.split('/').pop(),
      errorCode,
      errorMessage: video.error?.message,
      networkState: video.networkState,
      readyState: video.readyState,
      retryCount: retryCountRef.current,
    });

    const canRetry = errorCode === NETWORK_ERROR_CODE && retryCountRef.current < MAX_RETRIES;

    if (canRetry) {
      retryCountRef.current += 1;
      setTimeout(() => {
        video.load();
      }, 1000);
    }
    else {
      // Permanent error or max retries reached
      if (retryCountRef.current >= MAX_RETRIES) {
        console.error('[SkillCard] Max retries reached, giving up');
      }
      setHasError(true);
      retryCountRef.current = 0;
    }
  };

  const handleVideoLoadStart = () => {
    setHasError(false);
  };

  const handleVideoCanPlay = () => {
    // No-op
  };

  return {
    videoLoaded,
    hasError,
    handleVideoLoad,
    handleVideoError,
    handleVideoLoadStart,
    handleVideoCanPlay,
  };
}
