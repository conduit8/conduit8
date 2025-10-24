interface VideoErrorFallbackProps {
  name: string;
}

/**
 * Error fallback component for failed video loads
 * Styled as a poster-like thumbnail so user doesn't perceive it as an error
 */
export function VideoErrorFallback({ name }: VideoErrorFallbackProps) {
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-muted px-6 text-center">
      <small className="font-medium text-foreground leading-relaxed">{name}</small>
    </div>
  );
}
