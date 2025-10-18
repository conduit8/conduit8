import { useState } from 'react';

interface UseVideoLoaderReturn {
  isLoaded: boolean;
  hasError: boolean;
  handlers: {
    onLoadedData: () => void;
    onError: () => void;
  };
}

/**
 * Manages video loading state
 * Handles load and error states for video elements
 */
export const useVideoLoader = (): UseVideoLoaderReturn => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  return {
    isLoaded,
    hasError,
    handlers: {
      onLoadedData: () => setIsLoaded(true),
      onError: () => setHasError(true),
    },
  };
};
