import { useState } from 'react';

export function useMediaLoading() {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [videoLoaded, setVideoLoaded] = useState(false);

  const handleImageLoad = () => setImageLoaded(true);

  const handleImageError = () => {
    console.error('[SkillCard] Image failed to load');
    setImageError(true);
  };

  const handleVideoLoad = () => setVideoLoaded(true);

  const handleVideoError = () => {
    console.error('[SkillCard] Video failed to load');
    // Silent failure for video - just don't play it
  };

  return {
    imageLoaded,
    imageError,
    videoLoaded,
    handleImageLoad,
    handleImageError,
    handleVideoLoad,
    handleVideoError,
  };
}
