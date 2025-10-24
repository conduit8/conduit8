interface LazyVideoProps {
  src: string;
  className?: string;
  autoPlay?: boolean;
  loop?: boolean;
  muted?: boolean;
  playsInline?: boolean;
  onLoadedData?: (event: React.SyntheticEvent<HTMLVideoElement>) => void;
  onError?: (event: React.SyntheticEvent<HTMLVideoElement, Event>) => void;
  onLoadStart?: (event: React.SyntheticEvent<HTMLVideoElement>) => void;
  onCanPlay?: (event: React.SyntheticEvent<HTMLVideoElement>) => void;
}

/**
 * Lazy-loaded video component
 * Uses <source data-src> pattern to prevent browser from loading until triggered
 * Ref must be observed by parent using use-video-intersection hook
 */
export const LazyVideo = (
  { ref, src, className, autoPlay = true, loop = true, muted = true, playsInline = true, onLoadedData, onError, onLoadStart, onCanPlay }: LazyVideoProps & { ref?: React.RefObject<HTMLVideoElement | null> },
) => {
  return (
    <video
      ref={ref}
      className={className}
      autoPlay={autoPlay}
      loop={loop}
      muted={muted}
      playsInline={playsInline}
      onLoadedData={onLoadedData}
      onError={onError}
      onLoadStart={onLoadStart}
      onCanPlay={onCanPlay}
    >
      <source data-src={src} type="video/webm" />
    </video>
  );
};

LazyVideo.displayName = 'LazyVideo';
