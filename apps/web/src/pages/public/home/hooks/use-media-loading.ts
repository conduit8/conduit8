import { useState } from 'react';

export function useMediaLoading() {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [videoLoaded, setVideoLoaded] = useState(false);

  const handleImageLoad = () => setImageLoaded(true);
  const handleVideoLoad = () => setVideoLoaded(true);

  return {
    imageLoaded,
    videoLoaded,
    handleImageLoad,
    handleVideoLoad,
  };
}
