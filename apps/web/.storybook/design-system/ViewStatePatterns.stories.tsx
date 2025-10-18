import type { Meta, StoryObj } from '@storybook/react';

const meta: Meta = {
  title: 'Guides/View State Separation',
  parameters: {
    layout: 'padded',
  },
};

export default meta;

type Story = StoryObj;

export const ComplexExample: Story = {
  render: () => (
    <div className="space-y-8 p-4">
      <h2 className="text-2xl font-bold">View vs State Separation Patterns</h2>

      {/* Example 1: Transcript Feature */}
      <section className="space-y-4">
        <h3 className="text-lg font-semibold">❌ Bad: Mixed Concerns</h3>
        <pre className="bg-muted p-4 rounded text-sm overflow-x-auto">
{`// TranscriptPage.tsx - Everything mixed together
function TranscriptPage({ id }: { id: string }) {
  const [transcript, setTranscript] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isExporting, setIsExporting] = useState(false);

  useEffect(() => {
    fetch(\`/api/transcripts/\${id}\`)
      .then(res => res.json())
      .then(data => {
        setTranscript(data);
        setLoading(false);
      })
      .catch(err => {
        setError(err);
        setLoading(false);
      });
  }, [id]);

  const handleExport = async () => {
    setIsExporting(true);
    const doc = new jsPDF();
    doc.text(transcript.title, 10, 10);
    transcript.segments.forEach((seg, i) => {
      doc.text(\`\${seg.speaker}: \${seg.text}\`, 10, 20 + i * 10);
    });
    doc.save('transcript.pdf');
    setIsExporting(false);
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      <h1>{transcript.title}</h1>
      <button onClick={handleExport} disabled={isExporting}>
        {isExporting ? 'Exporting...' : 'Export PDF'}
      </button>
      {transcript.segments.map(seg => (
        <div key={seg.id}>
          <strong>{seg.speaker}:</strong> {seg.text}
        </div>
      ))}
    </div>
  );
}`}
        </pre>

        <h3 className="text-lg font-semibold">✅ Good: Separated Concerns</h3>
        <pre className="bg-muted p-4 rounded text-sm overflow-x-auto">
{`// 1. Domain Model - transcript.model.ts
export class TranscriptModel {
  constructor(private data: TranscriptData) {}

  get displayTitle() {
    return this.data.title || 'Untitled Transcript';
  }

  get duration() {
    const seconds = this.data.endTime - this.data.startTime;
    return formatDuration(seconds);
  }

  get speakerCount() {
    return new Set(this.data.segments.map(s => s.speaker)).size;
  }

  getSpeakerSegments(speaker: string) {
    return this.data.segments.filter(s => s.speaker === speaker);
  }
}

// 2. Service/Utils - transcript-export.service.ts
export class TranscriptExporter {
  async toPDF(transcript: TranscriptModel): Promise<Blob> {
    const doc = new jsPDF();
    // PDF generation logic
    return doc.output('blob');
  }

  async toWord(transcript: TranscriptModel): Promise<Blob> {
    // Word export logic
  }

  async toJSON(transcript: TranscriptModel): Promise<string> {
    return JSON.stringify(transcript, null, 2);
  }
}

// 3. Custom Hook - useTranscript.ts
function useTranscript(id: string) {
  const { data, isLoading, error } = useQuery({
    queryKey: ['transcript', id],
    queryFn: () => fetchTranscript(id),
    select: (data) => new TranscriptModel(data), // Transform to domain model
  });

  return {
    transcript: data,
    isLoading,
    error,
  };
}

// 4. Export Hook - useTranscriptExport.ts
function useTranscriptExport(transcript: TranscriptModel | undefined) {
  const [isExporting, setIsExporting] = useState(false);
  const [exportError, setExportError] = useState<Error | null>(null);

  const exporter = useMemo(() => new TranscriptExporter(), []);

  const exportToPDF = useCallback(async () => {
    if (!transcript) return;

    setIsExporting(true);
    setExportError(null);

    try {
      const blob = await exporter.toPDF(transcript);
      downloadBlob(blob, \`\${transcript.displayTitle}.pdf\`);
    } catch (err) {
      setExportError(err as Error);
    } finally {
      setIsExporting(false);
    }
  }, [transcript, exporter]);

  return { exportToPDF, isExporting, exportError };
}

// 5. View Components - Pure presentation
// TranscriptHeader.tsx
export function TranscriptHeader({
  title,
  duration,
  onExport,
  isExporting
}: TranscriptHeaderProps) {
  return (
    <header className="flex justify-between items-center">
      <div>
        <h1>{title}</h1>
        <span className="text-sm text-muted">{duration}</span>
      </div>
      <Button onClick={onExport} disabled={isExporting}>
        {isExporting ? 'Exporting...' : 'Export PDF'}
      </Button>
    </header>
  );
}

// TranscriptSegment.tsx
export function TranscriptSegment({ speaker, text, timestamp }: SegmentProps) {
  return (
    <div className="border-l-2 pl-4 py-2">
      <div className="flex gap-2 items-center">
        <span className="font-semibold">{speaker}</span>
        <span className="text-xs text-muted">{timestamp}</span>
      </div>
      <p>{text}</p>
    </div>
  );
}

// 6. Container Component - Orchestrates everything
// TranscriptPageContainer.tsx
export function TranscriptPageContainer({ id }: { id: string }) {
  const { transcript, isLoading, error } = useTranscript(id);
  const { exportToPDF, isExporting } = useTranscriptExport(transcript);

  if (isLoading) return <TranscriptSkeleton />;
  if (error) return <TranscriptError error={error} />;
  if (!transcript) return <TranscriptNotFound />;

  return (
    <TranscriptPageView
      transcript={transcript}
      onExport={exportToPDF}
      isExporting={isExporting}
    />
  );
}

// TranscriptPageView.tsx - Pure view
function TranscriptPageView({
  transcript,
  onExport,
  isExporting
}: TranscriptPageViewProps) {
  return (
    <div className="space-y-4">
      <TranscriptHeader
        title={transcript.displayTitle}
        duration={transcript.duration}
        onExport={onExport}
        isExporting={isExporting}
      />
      <div className="space-y-2">
        {transcript.segments.map(segment => (
          <TranscriptSegment key={segment.id} {...segment} />
        ))}
      </div>
    </div>
  );
}`}
        </pre>
      </section>

      {/* Naming Conventions */}
      <section className="space-y-4">
        <h3 className="text-lg font-semibold">Naming Conventions</h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="border rounded p-4">
            <h4 className="font-semibold mb-2">Container Components</h4>
            <ul className="space-y-1 text-sm">
              <li>• TranscriptPage<strong>Container</strong></li>
              <li>• UserProfile<strong>Container</strong></li>
              <li>• Dashboard<strong>Layout</strong></li>
              <li>• Settings<strong>Page</strong></li>
              <li>• Modal<strong>Controller</strong></li>
            </ul>
            <p className="text-xs text-muted-foreground mt-2">
              Suffix: Container, Page, Layout, Controller
            </p>
          </div>

          <div className="border rounded p-4">
            <h4 className="font-semibold mb-2">Pure View Components</h4>
            <ul className="space-y-1 text-sm">
              <li>• TranscriptHeader</li>
              <li>• UserAvatar</li>
              <li>• Button</li>
              <li>• TranscriptSegment<strong>View</strong></li>
              <li>• Dashboard<strong>Content</strong></li>
            </ul>
            <p className="text-xs text-muted-foreground mt-2">
              No suffix or: View, Content, Display
            </p>
          </div>
        </div>
      </section>

      {/* Key Rules */}
      <section className="bg-accent/10 p-4 rounded">
        <h3 className="font-semibold mb-2">Golden Rules</h3>
        <ol className="list-decimal list-inside space-y-2 text-sm">
          <li><strong>Hooks return data</strong>, never JSX</li>
          <li><strong>Components use hooks</strong>, hooks never import components</li>
          <li><strong>Domain models</strong> transform raw data for UI consumption</li>
          <li><strong>Services/Utils</strong> handle complex operations (export, calculations)</li>
          <li><strong>Containers orchestrate</strong>, Views display</li>
          <li><strong>Props flow down</strong>, events bubble up</li>
        </ol>
      </section>

      {/* Example 2: Video Player */}
      <section className="space-y-4">
        <h3 className="text-lg font-semibold">Example 2: Video Player State</h3>
        <pre className="bg-muted p-4 rounded text-sm overflow-x-auto">
{`// useVideoPlayer.ts - All video logic encapsulated
function useVideoPlayer(src: string) {
  const [state, setState] = useState({
    isLoaded: false,
    isPlaying: false,
    hasError: false,
    currentTime: 0,
    duration: 0,
  });

  const videoRef = useRef<HTMLVideoElement>(null);

  const play = () => {
    videoRef.current?.play();
    setState(s => ({ ...s, isPlaying: true }));
  };

  const pause = () => {
    videoRef.current?.pause();
    setState(s => ({ ...s, isPlaying: false }));
  };

  const seek = (time: number) => {
    if (videoRef.current) {
      videoRef.current.currentTime = time;
    }
  };

  return {
    ...state,
    videoRef,
    controls: { play, pause, seek },
    handlers: {
      onLoadedData: () => setState(s => ({ ...s, isLoaded: true })),
      onError: () => setState(s => ({ ...s, hasError: true })),
      onTimeUpdate: (e: Event) => {
        const video = e.target as HTMLVideoElement;
        setState(s => ({
          ...s,
          currentTime: video.currentTime,
          duration: video.duration,
        }));
      },
    },
  };
}

// VideoPlayer.tsx - Pure view component
function VideoPlayer({ src }: { src: string }) {
  const {
    isLoaded,
    hasError,
    videoRef,
    handlers,
    controls,
    currentTime,
    duration,
  } = useVideoPlayer(src);

  return (
    <div className="relative">
      {!isLoaded && <VideoSkeleton />}
      {hasError && <VideoError />}

      <video
        ref={videoRef}
        src={src}
        {...handlers}
        className={isLoaded ? 'opacity-100' : 'opacity-0'}
      />

      <VideoControls
        currentTime={currentTime}
        duration={duration}
        onPlay={controls.play}
        onPause={controls.pause}
        onSeek={controls.seek}
      />
    </div>
  );
}`}
        </pre>
      </section>

      {/* Directory Structure */}
      <section className="space-y-4">
        <h3 className="text-lg font-semibold">Recommended Directory Structure</h3>
        <pre className="bg-muted p-4 rounded text-sm">
{`src/
├── features/
│   └── transcript/
│       ├── components/           # View components
│       │   ├── TranscriptHeader.tsx
│       │   ├── TranscriptSegment.tsx
│       │   └── TranscriptPageView.tsx
│       ├── containers/           # Container components
│       │   └── TranscriptPageContainer.tsx
│       ├── hooks/                # Custom hooks
│       │   ├── useTranscript.ts
│       │   └── useTranscriptExport.ts
│       ├── models/               # Domain models
│       │   └── transcript.model.ts
│       ├── services/            # Business logic
│       │   └── transcript-export.service.ts
│       └── types/               # TypeScript types
│           └── transcript.types.ts`}
        </pre>
      </section>
    </div>
  ),
};