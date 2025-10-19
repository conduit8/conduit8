import type { Meta } from '@storybook/react-vite';

// Logo Alternative Components for Conduit8

// 1. C Pixelated (User Request)
const Logo1PixelatedC = ({ size = 32 }) => (
  <div className="inline-flex items-center gap-2">
    <div className={`relative flex items-center justify-center bg-foreground rounded`} style={{ width: size, height: size }}>
      <svg width="100%" height="100%" viewBox="0 0 8 8" fill="none" shapeRendering="crispEdges">
        {[
          0, 1, 1, 1, 1, 1, 0, 0,
          1, 1, 0, 0, 0, 0, 1, 0,
          1, 0, 0, 0, 0, 0, 0, 0,
          1, 0, 0, 0, 0, 0, 0, 0,
          1, 0, 0, 0, 0, 0, 0, 0,
          1, 0, 0, 0, 0, 0, 0, 0,
          1, 1, 0, 0, 0, 0, 1, 0,
          0, 1, 1, 1, 1, 1, 0, 0,
        ].map((pixel, i) => {
          if (!pixel) return null;
          const x = i % 8;
          const y = Math.floor(i / 8);
          return <rect key={i} x={x} y={y} width="1" height="1" fill="currentColor" className="fill-background" />;
        })}
      </svg>
    </div>
    <span className="font-brand font-bold text-foreground" style={{ fontSize: size * 0.6 }}>Conduit8</span>
  </div>
);

// 2. C8 Combined (User Request - C morphs into 8)
const Logo2C8Combined = ({ size = 32 }) => (
  <div className="inline-flex items-center gap-2">
    <div className="relative flex items-center justify-center bg-foreground rounded" style={{ width: size * 1.2, height: size }}>
      <svg width="100%" height="100%" viewBox="0 0 24 20" fill="none">
        {/* C shape on left */}
        <path d="M2 10 Q2 2 10 2 L12 2 L12 5 L10 5 Q5 5 5 10 Q5 15 10 15 L12 15 L12 18 L10 18 Q2 18 2 10" fill="white" stroke="rgb(251, 146, 60)" strokeWidth="1" />
        {/* 8 shape on right */}
        <circle cx="18" cy="7" r="3.5" fill="transparent" stroke="white" strokeWidth="2" />
        <circle cx="18" cy="13" r="3.5" fill="transparent" stroke="white" strokeWidth="2" />
      </svg>
    </div>
    <span className="font-brand font-bold text-foreground" style={{ fontSize: size * 0.6 }}>Conduit8</span>
  </div>
);

// 3. Pixelated C with Vertical 8 (User Request - Pure SVG)
const Logo3PixelatedCWith8 = ({ size = 32 }) => (
  <div className="inline-flex items-center gap-2">
    <div className={`relative flex items-center justify-center bg-foreground rounded`} style={{ width: size, height: size }}>
      <svg width="100%" height="100%" viewBox="0 0 8 8" fill="none">
        {/* Pixelated C background */}
        {[
          0, 1, 1, 1, 1, 1, 0, 0,
          1, 1, 0, 0, 0, 0, 1, 0,
          1, 0, 0, 0, 0, 0, 0, 0,
          1, 0, 0, 0, 0, 0, 0, 0,
          1, 0, 0, 0, 0, 0, 0, 0,
          1, 0, 0, 0, 0, 0, 0, 0,
          1, 1, 0, 0, 0, 0, 1, 0,
          0, 1, 1, 1, 1, 1, 0, 0,
        ].map((pixel, i) => {
          if (!pixel) return null;
          const x = i % 8;
          const y = Math.floor(i / 8);
          return <rect key={i} x={x} y={y} width="1" height="1" fill="white" shapeRendering="crispEdges" />;
        })}
        {/* Text 8 as SVG text element */}
        <text
          x="4"
          y="4"
          fontFamily="Space Mono, monospace"
          fontSize="4"
          fontWeight="700"
          fill="rgb(251, 146, 60)"
          textAnchor="middle"
          dominantBaseline="central"
        >
          8
        </text>
      </svg>
    </div>
    <span className="font-brand font-bold text-foreground" style={{ fontSize: size * 0.6 }}>Conduit8</span>
  </div>
);

// 4. Simple Text [C8] (User Request - Square with accent font)
const Logo4TextBracketC8 = ({ size = 32 }) => (
  <div className="inline-flex items-center gap-2">
    <div className={`relative flex items-center justify-center rounded`} style={{ width: size, height: size }}>
      <span className="font-brand font-bold text-2xl tracking-tighter">
        <span className="text-accent">[</span>
        <span className="text-foreground">C8</span>
        <span className="text-accent">]</span>
      </span>
    </div>
    <span className="font-brand font-bold text-foreground text-2xl">conduit8</span>
  </div>
);

// 5. Circuit Board C8
const Logo5CircuitC8 = ({ size = 32 }) => (
  <div className="inline-flex items-center gap-2">
    <div className="relative flex items-center justify-center bg-foreground rounded" style={{ width: size * 1.3, height: size }}>
      <svg width="90%" height="90%" viewBox="0 0 26 20" fill="none">
        {/* Circuit traces forming C */}
        <path d="M8 2 L2 2 L2 18 L8 18" stroke="white" strokeWidth="2" fill="none" />
        <path d="M8 2 L14 2" stroke="white" strokeWidth="2" />
        <path d="M8 18 L14 18" stroke="white" strokeWidth="2" />
        {/* Number 8 with circuit nodes */}
        <circle cx="20" cy="7" r="3" stroke="white" strokeWidth="1.5" fill="transparent" />
        <circle cx="20" cy="13" r="3" stroke="white" strokeWidth="1.5" fill="transparent" />
        <circle cx="20" cy="7" r="1" fill="rgb(251, 146, 60)" />
        <circle cx="20" cy="13" r="1" fill="rgb(251, 146, 60)" />
      </svg>
    </div>
    <span className="font-brand font-bold text-foreground" style={{ fontSize: size * 0.6 }}>Conduit8</span>
  </div>
);

// 6. Hexagonal C8 Badge
const Logo6HexC8 = ({ size = 32 }) => (
  <div className="inline-flex items-center gap-2">
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width="100%" height="100%" viewBox="0 0 24 28" fill="none">
        {/* Hexagon */}
        <path d="M12 2 L22 8 L22 20 L12 26 L2 20 L2 8 Z" fill="black" stroke="black" strokeWidth="2" />
        {/* C8 inside */}
        <text x="7" y="18" fontFamily="Space Mono, monospace" fontSize="14" fontWeight="700" fill="white">C</text>
        <text x="14" y="18" fontFamily="Space Mono, monospace" fontSize="12" fontWeight="700" fill="rgb(251, 146, 60)">8</text>
      </svg>
    </div>
    <span className="font-brand font-bold text-foreground" style={{ fontSize: size * 0.6 }}>Conduit8</span>
  </div>
);

// 7. Bracket Code Style <C8>
const Logo7BracketC8 = ({ size = 32 }) => (
  <div className="inline-flex items-center gap-2">
    <div className="relative flex items-center justify-center bg-foreground rounded px-1" style={{ height: size }}>
      <span className="font-mono font-bold text-background" style={{ fontSize: size * 0.5 }}>&lt;C8&gt;</span>
    </div>
    <span className="font-brand font-bold text-foreground" style={{ fontSize: size * 0.6 }}>Conduit8</span>
  </div>
);

// 8. Stacked C/8 (vertically)
const Logo8StackedC8 = ({ size = 32 }) => (
  <div className="inline-flex items-center gap-2">
    <div className="relative flex items-center justify-center bg-foreground rounded" style={{ width: size * 0.9, height: size }}>
      <div className="flex flex-col items-center justify-center leading-none">
        <span className="font-mono font-bold text-background leading-none" style={{ fontSize: size * 0.45 }}>C</span>
        <div className="bg-[rgb(251,146,60)]" style={{ width: size * 0.6, height: 2, margin: '1px 0' }}></div>
        <span className="font-mono font-bold text-background leading-none" style={{ fontSize: size * 0.45 }}>8</span>
      </div>
    </div>
    <span className="font-brand font-bold text-foreground" style={{ fontSize: size * 0.6 }}>Conduit8</span>
  </div>
);

// 9. Overlapping Monogram C8
const Logo9MonogramC8 = ({ size = 32 }) => (
  <div className="inline-flex items-center gap-2">
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width="100%" height="100%" viewBox="0 0 28 32" fill="none">
        {/* Large C */}
        <path d="M24 8 Q24 2 16 2 Q8 2 8 8 L8 24 Q8 30 16 30 Q24 30 24 24" stroke="black" strokeWidth="4" fill="none" />
        {/* Overlapping 8 in orange */}
        <circle cx="16" cy="11" r="4" stroke="rgb(251, 146, 60)" strokeWidth="2.5" fill="white" />
        <circle cx="16" cy="21" r="4" stroke="rgb(251, 146, 60)" strokeWidth="2.5" fill="white" />
      </svg>
    </div>
    <span className="font-brand font-bold text-foreground" style={{ fontSize: size * 0.6 }}>Conduit8</span>
  </div>
);

// 10. Minimal C with 8 Badge
const Logo10MinimalC8 = ({ size = 32 }) => (
  <div className="inline-flex items-center gap-2">
    <div className="relative">
      <span className="font-mono font-bold text-foreground" style={{ fontSize: size * 1.1 }}>C</span>
      <div className="absolute -top-1 -right-2 bg-[rgb(251,146,60)] rounded flex items-center justify-center" style={{ width: size * 0.5, height: size * 0.5 }}>
        <span className="font-mono font-bold text-background" style={{ fontSize: size * 0.3 }}>8</span>
      </div>
    </div>
    <span className="font-brand font-bold text-foreground" style={{ fontSize: size * 0.6 }}>Conduit8</span>
  </div>
);

// Main wrapper for compatibility
const LogoWrapper = ({ size = 'md', variant = 'default', className = '', interactive = true }: any) => {
  const sizeConfig: any = {
    sm: {
      icon: 'h-6 w-6',
      text: 'text-lg',
      gap: 'gap-1.5',
    },
    md: {
      icon: 'h-8 w-8',
      text: 'text-xl',
      gap: 'gap-2',
    },
    lg: {
      icon: 'h-10 w-10',
      text: 'text-xl',
      gap: 'gap-2.5',
    },
  };

  const config = sizeConfig[size];
  const showIcon = variant === 'default' || variant === 'icon';
  const showText = variant === 'default' || variant === 'text';

  return (
    <div className={`inline-flex items-center ${config.gap} ${className}`}>
      {showIcon && (
        <div
          className={`
            ${config.icon}
            relative flex items-center justify-center
            bg-black rounded group
            ${interactive ? 'cursor-pointer transform-gpu transition-all duration-200 hover:scale-105 active:scale-95' : ''}
          `}
        >
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="absolute inset-1 border border-white rounded-sm opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
            <div className="grid grid-cols-8 gap-0 relative z-10">
              {[
                0, 1, 1, 1, 1, 1, 0, 0,
                1, 1, 0, 0, 0, 0, 1, 0,
                1, 0, 0, 0, 0, 0, 0, 0,
                1, 0, 0, 0, 0, 0, 0, 0,
                1, 0, 0, 0, 0, 0, 0, 0,
                1, 0, 0, 0, 0, 0, 0, 0,
                1, 1, 0, 0, 0, 0, 1, 0,
                0, 1, 1, 1, 1, 1, 0, 0,
              ].map((pixel, i) => (
                <div
                  key={i}
                  className={`
                    aspect-square
                    ${pixel ? 'bg-white' : 'bg-transparent'}
                    ${size === 'sm' ? 'w-[0.375px] h-[0.375px]' : size === 'md' ? 'w-[0.5px] h-[0.5px]' : 'w-[0.75px] h-[0.75px]'}
                  `}
                />
              ))}
            </div>
          </div>
        </div>
      )}
      {showText && (
        <span className={`font-brand text-foreground font-bold tracking-wide ${config.text}`}>
          Conduit8
        </span>
      )}
    </div>
  );
};

const meta = {
  title: 'Design System/Brand',
  component: LogoWrapper,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof LogoWrapper>;

export default meta;

// Logo Alternatives Showcase
export const LogoAlternatives = () => {
  const logos = [
    { component: Logo1PixelatedC, name: '1. Pixelated C', description: 'Retro pixel art C - easy to remember, simple grid' },
    { component: Logo2C8Combined, name: '2. C8 Combined', description: 'C morphing into 8 - unified letterform' },
    { component: Logo3PixelatedCWith8, name: '3. Pixelated C + Vertical 8', description: 'Pixel C with smooth vertical 8 inside' },
    { component: Logo4TextBracketC8, name: '4. Text [C8]', description: 'Simple monospace bracket style - clean, minimal' },
    { component: Logo5CircuitC8, name: '5. Circuit Board C8', description: 'Tech/electronic aesthetic with traces' },
    { component: Logo6HexC8, name: '6. Hexagonal Badge', description: 'C8 in hex container - geometric, solid' },
    { component: Logo7BracketC8, name: '7. Code Bracket <C8>', description: 'Terminal/code syntax - developer-friendly' },
    { component: Logo8StackedC8, name: '8. Stacked C/8', description: 'Vertical stack with orange divider' },
    { component: Logo9MonogramC8, name: '9. Overlapping Monogram', description: 'C and 8 intersecting - sophisticated' },
    { component: Logo10MinimalC8, name: '10. C with 8 Badge', description: 'Simple C with orange numbered badge' },
  ];

  return (
    <div className="space-y-16 p-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">Conduit8 Logo Alternatives</h1>
        <p className="text-muted-foreground mb-8">10 variations exploring C and C8 combinations - all simple and memorable</p>
      </div>

      {/* Full Logos (Icon + Text) */}
      <div>
        <h2 className="text-2xl font-bold mb-6">Full Logos (Icon + Text)</h2>
        <div className="grid grid-cols-2 gap-8">
          {logos.map((logo, i) => {
            const LogoComponent = logo.component;
            return (
              <div key={i} className="border-border bg-card rounded-lg border p-8">
                <div className="flex items-center justify-center h-24 mb-4">
                  <LogoComponent size={48} />
                </div>
                <div className="text-center">
                  <h3 className="font-bold mb-1">{logo.name}</h3>
                  <p className="text-sm text-muted-foreground">{logo.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Icon Only Variations */}
      <div>
        <h2 className="text-2xl font-bold mb-6">Icon Only (for favicons, avatars, small spaces)</h2>
        <div className="border-border bg-card rounded-lg border p-8">
          <div className="grid grid-cols-5 gap-8">
            {logos.map((logo, i) => {
              const LogoComponent = logo.component;
              return (
                <div key={i} className="flex flex-col items-center gap-3">
                  <div className="flex items-center justify-center h-16">
                    <div className="inline-flex">
                      <LogoComponent size={40} />
                    </div>
                  </div>
                  <span className="text-xs text-muted-foreground text-center">{logo.name.split('.')[0]}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Text Only Variations */}
      <div>
        <h2 className="text-2xl font-bold mb-6">Wordmark Variations</h2>
        <div className="border-border bg-card rounded-lg border p-8">
          <div className="grid grid-cols-2 gap-12">
            <div className="flex flex-col items-center gap-4">
              <span className="font-brand font-bold text-foreground text-3xl">Conduit8</span>
              <p className="text-sm text-muted-foreground">Standard (Space Mono)</p>
            </div>
            <div className="flex flex-col items-center gap-4">
              <span className="font-brand font-bold text-foreground text-3xl uppercase">CONDUIT8</span>
              <p className="text-sm text-muted-foreground">All Caps</p>
            </div>
            <div className="flex flex-col items-center gap-4">
              <div className="flex items-center gap-1">
                <span className="font-brand font-bold text-foreground text-3xl">Conduit</span>
                <span className="font-brand font-bold text-[rgb(251,146,60)] text-3xl">8</span>
              </div>
              <p className="text-sm text-muted-foreground">Orange 8 Accent</p>
            </div>
            <div className="flex flex-col items-center gap-4">
              <div className="flex flex-col">
                <span className="font-brand font-bold text-foreground text-3xl leading-none">Conduit8</span>
                <div className="bg-[rgb(251,146,60)] h-1 w-full mt-1"></div>
              </div>
              <p className="text-sm text-muted-foreground">With Underline</p>
            </div>
          </div>
        </div>
      </div>

      {/* Recommendations */}
      <div className="border-border bg-accent-muted rounded-lg border p-8">
        <h2 className="text-2xl font-bold mb-4">Analysis & Recommendations</h2>
        <div className="space-y-4 text-sm">
          <div>
            <strong className="text-accent">Easiest to Replicate (SVG/Code):</strong>
            <p className="text-muted-foreground">#1 Pixelated C (8x8 grid), #7 Bracket (text only), #10 Minimal (simple shapes)</p>
          </div>
          <div>
            <strong className="text-accent">Most Memorable/Distinctive:</strong>
            <p className="text-muted-foreground">#2 C8 Combined (unique fusion), #4 Figure-8 (clever visual), #9 Monogram (sophisticated overlap)</p>
          </div>
          <div>
            <strong className="text-accent">Best for Developer Tools:</strong>
            <p className="text-muted-foreground">#5 Circuit Board (tech aesthetic), #7 Bracket (code syntax), #3 Pipe (literal "conduit")</p>
          </div>
          <div>
            <strong className="text-accent">Works at All Sizes:</strong>
            <p className="text-muted-foreground">#1 Pixelated (scalable grid), #6 Hexagonal (strong shape), #10 Minimal (clear hierarchy)</p>
          </div>
          <div>
            <strong className="text-accent">Top 3 Picks:</strong>
            <p className="text-muted-foreground">
              <strong>1. #1 Pixelated C</strong> - Your request, retro/memorable, 8x8 grid trivial to replicate<br />
              <strong>2. #7 Bracket &lt;C8&gt;</strong> - Perfect for dev tool, instantly conveys "code", ultra-simple<br />
              <strong>3. #3 Pipe/Conduit</strong> - Literally visualizes "conduit", unique, orange accent as connection nodes
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

// Keep original showcase for backward compatibility
export const LogoShowcase = () => {
  const sizes = ['sm', 'md', 'lg'] as const;
  const variants = ['default', 'text', 'icon'] as const;

  return (
    <div className="space-y-12">
      {/* Variants Section */}
      <div>
        <h2 className="mb-4 text-xl font-bold">Current Logo Variants</h2>
        <div className="border-border bg-card grid grid-cols-3 gap-8 rounded-lg border p-6">
          {variants.map((variant) => (
            <div key={variant} className="flex flex-col items-center">
              <div className="flex h-16 items-center justify-center">
                <LogoWrapper variant={variant} size="md" />
              </div>
              <div className="mt-4 text-center">
                <code className="bg-surface rounded px-2 py-1">{variant}</code>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
