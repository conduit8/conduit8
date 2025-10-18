import type { Meta } from '@storybook/react-vite';

// Logo Alternative Components

// 1. Current Pixelated K
const Logo1Current = ({ size = 32 }) => (
  <div className="inline-flex items-center gap-2">
    <div className={`relative flex items-center justify-center bg-foreground rounded`} style={{ width: size, height: size }}>
      <svg width="100%" height="100%" viewBox="0 0 8 10" fill="none" shapeRendering="crispEdges">
        {[1,1,0,0,0,0,1,1,1,1,0,0,0,0,1,1,1,1,0,0,1,1,0,0,1,1,0,0,1,1,0,0,1,1,1,1,0,0,0,0,1,1,1,1,0,0,0,0,1,1,0,0,1,1,0,0,1,1,0,0,1,1,0,0,1,1,0,0,0,0,1,1,1,1,0,0,0,0,1,1].map((pixel, i) => {
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

// 2. Chromatic Offset (Print Misalignment)
const Logo2Chromatic = ({ size = 32 }) => (
  <div className="inline-flex items-center gap-2">
    <div className="relative" style={{ width: size, height: size }}>
      <svg width="100%" height="100%" viewBox="0 0 24 32" fill="none" className="absolute">
        <text x="12" y="24" fontFamily="Space Mono, monospace" fontSize="28" fontWeight="700" fill="rgb(251, 146, 60)" textAnchor="middle">K</text>
      </svg>
      <svg width="100%" height="100%" viewBox="0 0 24 32" fill="none" className="absolute" style={{ transform: 'translate(2px, 2px)' }}>
        <text x="12" y="24" fontFamily="Space Mono, monospace" fontSize="28" fontWeight="700" fill="white" textAnchor="middle">K</text>
      </svg>
      <svg width="100%" height="100%" viewBox="0 0 24 32" fill="none" className="absolute" style={{ transform: 'translate(4px, 4px)' }}>
        <text x="12" y="24" fontFamily="Space Mono, monospace" fontSize="28" fontWeight="700" fill="black" textAnchor="middle">K</text>
      </svg>
    </div>
    <span className="font-brand font-bold text-foreground" style={{ fontSize: size * 0.6 }}>Conduit8</span>
  </div>
);

// 3. Terminal Block K with Orange Cursor
const Logo3Terminal = ({ size = 32 }) => (
  <div className="inline-flex items-center gap-2">
    <div className="relative bg-foreground rounded flex items-center justify-center" style={{ width: size, height: size * 1.2 }}>
      <span className="font-mono font-bold text-background" style={{ fontSize: size * 0.8 }}>K</span>
      <div className="absolute bottom-1 right-1 bg-[rgb(251,146,60)]" style={{ width: size * 0.15, height: size * 0.15 }}></div>
    </div>
    <span className="font-brand font-bold text-foreground" style={{ fontSize: size * 0.6 }}>Conduit8</span>
  </div>
);

// 4. Bold Outlined K with Hard Shadow
const Logo4Outlined = ({ size = 32 }) => (
  <div className="inline-flex items-center gap-2">
    <div className="relative" style={{ width: size, height: size }}>
      {/* Hard shadow */}
      <svg width="100%" height="100%" viewBox="0 0 24 32" fill="none" className="absolute" style={{ transform: 'translate(4px, 4px)' }}>
        <text x="12" y="24" fontFamily="Space Mono, monospace" fontSize="28" fontWeight="700" fill="black" stroke="black" strokeWidth="2" textAnchor="middle">K</text>
      </svg>
      {/* Main letter */}
      <svg width="100%" height="100%" viewBox="0 0 24 32" fill="none" className="absolute">
        <text x="12" y="24" fontFamily="Space Mono, monospace" fontSize="28" fontWeight="700" fill="white" stroke="black" strokeWidth="3" textAnchor="middle">K</text>
      </svg>
    </div>
    <span className="font-brand font-bold text-foreground" style={{ fontSize: size * 0.6 }}>Conduit8</span>
  </div>
);

// 5. Geometric K with Orange Bar
const Logo5Geometric = ({ size = 32 }) => (
  <div className="inline-flex items-center gap-2">
    <div className="relative bg-foreground rounded flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width="80%" height="80%" viewBox="0 0 20 20" fill="none">
        <path d="M2 0 L2 20 L6 20 L6 12 L10 16 L10 20 L14 20 L14 14 L10 10 L14 6 L14 0 L10 0 L10 4 L6 8 L6 0 Z" fill="white"/>
        <rect x="0" y="18" width="20" height="2" fill="rgb(251, 146, 60)"/>
      </svg>
    </div>
    <span className="font-brand font-bold text-foreground" style={{ fontSize: size * 0.6 }}>Conduit8</span>
  </div>
);

// 6. Connected Nodes K (AI/Network)
const Logo6Network = ({ size = 32 }) => (
  <div className="inline-flex items-center gap-2">
    <div className="relative" style={{ width: size, height: size }}>
      <svg width="100%" height="100%" viewBox="0 0 24 32" fill="none">
        <circle cx="4" cy="4" r="2" fill="black"/>
        <circle cx="4" cy="28" r="2" fill="black"/>
        <circle cx="20" cy="4" r="2" fill="black"/>
        <circle cx="20" cy="28" r="2" fill="black"/>
        <circle cx="12" cy="16" r="2" fill="rgb(251, 146, 60)"/>
        <line x1="4" y1="4" x2="4" y2="28" stroke="black" strokeWidth="2"/>
        <line x1="4" y1="4" x2="20" y2="4" stroke="black" strokeWidth="2"/>
        <line x1="4" y1="28" x2="20" y2="28" stroke="black" strokeWidth="2"/>
        <line x1="4" y1="4" x2="12" y2="16" stroke="black" strokeWidth="2"/>
        <line x1="12" y1="16" x2="20" y2="4" stroke="black" strokeWidth="2"/>
        <line x1="4" y1="28" x2="12" y2="16" stroke="black" strokeWidth="2"/>
        <line x1="12" y1="16" x2="20" y2="28" stroke="black" strokeWidth="2"/>
      </svg>
    </div>
    <span className="font-brand font-bold text-foreground" style={{ fontSize: size * 0.6 }}>Conduit8</span>
  </div>
);

// 7. Slash K (Code/Terminal)
const Logo7Slash = ({ size = 32 }) => (
  <div className="inline-flex items-center gap-1">
    <div className="relative bg-foreground rounded flex items-center justify-center px-1" style={{ height: size }}>
      <span className="font-mono font-bold text-background" style={{ fontSize: size * 0.6 }}>K/</span>
    </div>
    <span className="font-brand font-bold text-foreground" style={{ fontSize: size * 0.6 }}>Conduit8</span>
  </div>
);

// 8. K in Frame with Orange Corner
const Logo8Framed = ({ size = 32 }) => (
  <div className="inline-flex items-center gap-2">
    <div className="relative border-2 border-foreground rounded flex items-center justify-center" style={{ width: size, height: size }}>
      <span className="font-mono font-bold text-foreground" style={{ fontSize: size * 0.6 }}>K</span>
      <div className="absolute top-0 right-0 bg-[rgb(251,146,60)]" style={{ width: size * 0.25, height: size * 0.25 }}></div>
    </div>
    <span className="font-brand font-bold text-foreground" style={{ fontSize: size * 0.6 }}>Conduit8</span>
  </div>
);

// 9. Minimalist K with Orange Notification
const Logo9Minimal = ({ size = 32 }) => (
  <div className="inline-flex items-center gap-2">
    <div className="relative">
      <span className="font-mono font-bold text-foreground" style={{ fontSize: size }}>K</span>
      <div className="absolute -top-1 -right-1 bg-[rgb(251,146,60)] rounded-full" style={{ width: size * 0.3, height: size * 0.3 }}></div>
    </div>
    <span className="font-brand font-bold text-foreground" style={{ fontSize: size * 0.6 }}>Conduit8</span>
  </div>
);

// 10. Stacked K with Orange Underline
const Logo10Stacked = ({ size = 32 }) => (
  <div className="inline-flex items-center gap-2">
    <div className="relative">
      <div className="flex flex-col items-center">
        <span className="font-mono font-bold text-foreground leading-none" style={{ fontSize: size }}>K</span>
        <div className="bg-[rgb(251,146,60)]" style={{ width: size * 0.8, height: size * 0.15, marginTop: 2 }}></div>
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
                1,1, 0,0, 0,0, 1,1,
                1,1, 0,0, 0,0, 1,1,
                1,1, 0,0, 1,1, 0,0,
                1,1, 0,0, 1,1, 0,0,
                1,1, 1,1, 0,0, 0,0,
                1,1, 1,1, 0,0, 0,0,
                1,1, 0,0, 1,1, 0,0,
                1,1, 0,0, 1,1, 0,0,
                1,1, 0,0, 0,0, 1,1,
                1,1, 0,0, 0,0, 1,1,
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
    { component: Logo1Current, name: '1. Current Pixelated K', description: 'Existing pixel art logo' },
    { component: Logo2Chromatic, name: '2. Chromatic Offset', description: 'Print misalignment effect - dynamic & vintage' },
    { component: Logo3Terminal, name: '3. Terminal with Cursor', description: 'Code terminal aesthetic with orange cursor' },
    { component: Logo4Outlined, name: '4. Outlined with Shadow', description: 'Comic book lettering with hard shadow' },
    { component: Logo5Geometric, name: '5. Geometric K + Bar', description: 'Clean geometric form with orange accent' },
    { component: Logo6Network, name: '6. Connected Nodes', description: 'AI/network visualization' },
    { component: Logo7Slash, name: '7. Slash K (K/)', description: 'Terminal/code syntax' },
    { component: Logo8Framed, name: '8. Framed K', description: 'Bordered with orange corner accent' },
    { component: Logo9Minimal, name: '9. Minimal + Notification', description: 'Simple K with orange badge' },
    { component: Logo10Stacked, name: '10. Stacked with Underline', description: 'K with orange underline emphasis' },
  ];

  return (
    <div className="space-y-16 p-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">Logo Alternatives</h1>
        <p className="text-muted-foreground mb-8">10 variations exploring different directions for Conduit8's brand identity</p>
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
        <h2 className="text-2xl font-bold mb-6">Icon Only (for small spaces, favicons, avatars)</h2>
        <div className="border-border bg-card rounded-lg border p-8">
          <div className="grid grid-cols-5 gap-8">
            {logos.map((logo, i) => {
              const LogoComponent = logo.component;
              return (
                <div key={i} className="flex flex-col items-center gap-3">
                  <div className="flex items-center justify-center h-16">
                    {/* Render just the icon part */}
                    <div className="inline-flex">
                      {i === 0 && <div className="relative flex items-center justify-center bg-foreground rounded" style={{ width: 40, height: 40 }}><svg width="100%" height="100%" viewBox="0 0 8 10" fill="none" shapeRendering="crispEdges">{[1,1,0,0,0,0,1,1,1,1,0,0,0,0,1,1,1,1,0,0,1,1,0,0,1,1,0,0,1,1,0,0,1,1,1,1,0,0,0,0,1,1,1,1,0,0,0,0,1,1,0,0,1,1,0,0,1,1,0,0,1,1,0,0,1,1,0,0,0,0,1,1,1,1,0,0,0,0,1,1].map((pixel, idx) => {if (!pixel) return null; const x = idx % 8; const y = Math.floor(idx / 8); return <rect key={idx} x={x} y={y} width="1" height="1" fill="currentColor" className="fill-background" />;})}</svg></div>}
                      {i === 1 && <div className="relative" style={{ width: 40, height: 40 }}><svg width="100%" height="100%" viewBox="0 0 24 32" fill="none" className="absolute"><text x="12" y="24" fontFamily="Space Mono, monospace" fontSize="28" fontWeight="700" fill="rgb(251, 146, 60)" textAnchor="middle">K</text></svg><svg width="100%" height="100%" viewBox="0 0 24 32" fill="none" className="absolute" style={{ transform: 'translate(2px, 2px)' }}><text x="12" y="24" fontFamily="Space Mono, monospace" fontSize="28" fontWeight="700" fill="white" textAnchor="middle">K</text></svg><svg width="100%" height="100%" viewBox="0 0 24 32" fill="none" className="absolute" style={{ transform: 'translate(4px, 4px)' }}><text x="12" y="24" fontFamily="Space Mono, monospace" fontSize="28" fontWeight="700" fill="black" textAnchor="middle">K</text></svg></div>}
                      {i === 2 && <div className="relative bg-foreground rounded flex items-center justify-center" style={{ width: 40, height: 48 }}><span className="font-mono font-bold text-background" style={{ fontSize: 32 }}>K</span><div className="absolute bottom-1 right-1 bg-[rgb(251,146,60)]" style={{ width: 6, height: 6 }}></div></div>}
                      {i === 3 && <div className="relative" style={{ width: 40, height: 40 }}><svg width="100%" height="100%" viewBox="0 0 24 32" fill="none" className="absolute" style={{ transform: 'translate(4px, 4px)' }}><text x="12" y="24" fontFamily="Space Mono, monospace" fontSize="28" fontWeight="700" fill="black" stroke="black" strokeWidth="2" textAnchor="middle">K</text></svg><svg width="100%" height="100%" viewBox="0 0 24 32" fill="none" className="absolute"><text x="12" y="24" fontFamily="Space Mono, monospace" fontSize="28" fontWeight="700" fill="white" stroke="black" strokeWidth="3" textAnchor="middle">K</text></svg></div>}
                      {i === 4 && <div className="relative bg-foreground rounded flex items-center justify-center" style={{ width: 40, height: 40 }}><svg width="80%" height="80%" viewBox="0 0 20 20" fill="none"><path d="M2 0 L2 20 L6 20 L6 12 L10 16 L10 20 L14 20 L14 14 L10 10 L14 6 L14 0 L10 0 L10 4 L6 8 L6 0 Z" fill="white"/><rect x="0" y="18" width="20" height="2" fill="rgb(251, 146, 60)"/></svg></div>}
                      {i === 5 && <div className="relative" style={{ width: 40, height: 40 }}><svg width="100%" height="100%" viewBox="0 0 24 32" fill="none"><circle cx="4" cy="4" r="2" fill="black"/><circle cx="4" cy="28" r="2" fill="black"/><circle cx="20" cy="4" r="2" fill="black"/><circle cx="20" cy="28" r="2" fill="black"/><circle cx="12" cy="16" r="2" fill="rgb(251, 146, 60)"/><line x1="4" y1="4" x2="4" y2="28" stroke="black" strokeWidth="2"/><line x1="4" y1="4" x2="20" y2="4" stroke="black" strokeWidth="2"/><line x1="4" y1="28" x2="20" y2="28" stroke="black" strokeWidth="2"/><line x1="4" y1="4" x2="12" y2="16" stroke="black" strokeWidth="2"/><line x1="12" y1="16" x2="20" y2="4" stroke="black" strokeWidth="2"/><line x1="4" y1="28" x2="12" y2="16" stroke="black" strokeWidth="2"/><line x1="12" y1="16" x2="20" y2="28" stroke="black" strokeWidth="2"/></svg></div>}
                      {i === 6 && <div className="relative bg-foreground rounded flex items-center justify-center px-1" style={{ height: 40 }}><span className="font-mono font-bold text-background" style={{ fontSize: 24 }}>K/</span></div>}
                      {i === 7 && <div className="relative border-2 border-foreground rounded flex items-center justify-center" style={{ width: 40, height: 40 }}><span className="font-mono font-bold text-foreground" style={{ fontSize: 24 }}>K</span><div className="absolute top-0 right-0 bg-[rgb(251,146,60)]" style={{ width: 10, height: 10 }}></div></div>}
                      {i === 8 && <div className="relative"><span className="font-mono font-bold text-foreground" style={{ fontSize: 40 }}>K</span><div className="absolute -top-1 -right-1 bg-[rgb(251,146,60)] rounded-full" style={{ width: 12, height: 12 }}></div></div>}
                      {i === 9 && <div className="relative"><div className="flex flex-col items-center"><span className="font-mono font-bold text-foreground leading-none" style={{ fontSize: 40 }}>K</span><div className="bg-[rgb(251,146,60)]" style={{ width: 32, height: 6, marginTop: 2 }}></div></div></div>}
                    </div>
                  </div>
                  <span className="text-xs text-muted-foreground">#{i + 1}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Text Only Variations */}
      <div>
        <h2 className="text-2xl font-bold mb-6">Text Only (wordmark variations)</h2>
        <div className="border-border bg-card rounded-lg border p-8">
          <div className="grid grid-cols-2 gap-12">
            <div className="flex flex-col items-center gap-4">
              <span className="font-brand font-bold text-foreground text-3xl">Conduit8</span>
              <p className="text-sm text-muted-foreground">Standard (Space Mono)</p>
            </div>
            <div className="flex flex-col items-center gap-4">
              <span className="font-brand font-bold text-foreground text-3xl uppercase">KOLLEKTIV</span>
              <p className="text-sm text-muted-foreground">All Caps</p>
            </div>
            <div className="flex flex-col items-center gap-4">
              <div className="flex items-center gap-1">
                <span className="font-brand font-bold text-foreground text-3xl">Conduit8</span>
                <div className="w-2 h-2 bg-[rgb(251,146,60)] rounded-full"></div>
              </div>
              <p className="text-sm text-muted-foreground">With Orange Dot</p>
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
        <h2 className="text-2xl font-bold mb-4">Recommendations</h2>
        <div className="space-y-4 text-sm">
          <div>
            <strong className="text-accent">Best for Modern/Tech Feel:</strong>
            <p className="text-muted-foreground">#3 Terminal, #7 Slash K, #9 Minimal - Clean, direct, developer-friendly</p>
          </div>
          <div>
            <strong className="text-accent">Best for Graphic Novel Aesthetic:</strong>
            <p className="text-muted-foreground">#2 Chromatic, #4 Outlined - Most aligned with black/white/orange comic book vibe</p>
          </div>
          <div>
            <strong className="text-accent">Most Distinctive/Memorable:</strong>
            <p className="text-muted-foreground">#2 Chromatic, #5 Geometric - Stand out in crowded spaces, unique visual identity</p>
          </div>
          <div>
            <strong className="text-accent">Easiest to Reproduce as SVG:</strong>
            <p className="text-muted-foreground">#5 Geometric, #8 Framed, #9 Minimal, #10 Stacked - Simple paths, no complex effects</p>
          </div>
          <div>
            <strong className="text-accent">My Top Pick:</strong>
            <p className="text-muted-foreground"><strong>#2 Chromatic Offset</strong> - Perfect balance of graphic novel aesthetic, uses orange naturally, memorable, and can be simplified to clean SVG paths for assets</p>
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
