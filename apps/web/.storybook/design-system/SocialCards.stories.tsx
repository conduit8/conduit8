import type { Meta } from '@storybook/react-vite';

// Standard OG image size: 1200x630px (1.91:1 ratio)
const OG_WIDTH = 1200;
const OG_HEIGHT = 630;

// Logo component for cards
const LogoIcon = ({ size = 80 }: { size?: number }) => (
  <div className="relative flex items-center justify-center bg-foreground rounded" style={{ width: size, height: size }}>
    <svg width="100%" height="100%" viewBox="0 0 8 10" fill="none" shapeRendering="crispEdges">
      {[1,1,0,0,0,0,1,1,1,1,0,0,0,0,1,1,1,1,0,0,1,1,0,0,1,1,0,0,1,1,0,0,1,1,1,1,0,0,0,0,1,1,1,1,0,0,0,0,1,1,0,0,1,1,0,0,1,1,0,0,1,1,0,0,1,1,0,0,0,0,1,1,1,1,0,0,0,0,1,1].map((pixel, i) => {
        if (!pixel) return null;
        const x = i % 8;
        const y = Math.floor(i / 8);
        return <rect key={i} x={x} y={y} width="1" height="1" fill="currentColor" className="fill-background" />;
      })}
    </svg>
  </div>
);

// 1. Minimal Center - Clean and spacious with orange accent
const Card1MinimalCenter = () => (
  <div
    className="relative flex flex-col items-center justify-center gap-8 bg-background border-4 border-foreground"
    style={{ width: OG_WIDTH, height: OG_HEIGHT }}
  >
    <LogoIcon size={120} />
    <div className="flex flex-col items-center gap-4">
      <h1 className="font-brand font-bold text-foreground text-7xl">Conduit8</h1>
      <p className="font-brand text-muted-foreground text-3xl max-w-3xl text-center">
        Turn Slack messages into{' '}
        <span className="relative inline-block">
          shipped features
          <div className="absolute bottom-0 left-0 right-0 h-3 bg-[rgb(251,146,60)]/30 -z-10"></div>
        </span>
      </p>
    </div>
    <div className="absolute bottom-8 right-8">
      <span className="font-brand text-muted-foreground text-xl">conduit8.dev</span>
    </div>
  </div>
);

// 2. Comic Panel Grid - 3 panels showing workflow
const Card2ComicPanel = () => (
  <div
    className="relative bg-background"
    style={{ width: OG_WIDTH, height: OG_HEIGHT }}
  >
    <div className="grid grid-cols-3 h-full border-4 border-foreground">
      {/* Panel 1 */}
      <div className="border-r-4 border-foreground flex flex-col items-center justify-center gap-4 p-8 bg-background">
        <div className="text-8xl">💬</div>
        <p className="font-brand font-bold text-foreground text-2xl text-center">Message in Slack</p>
      </div>

      {/* Panel 2 - Main panel with logo */}
      <div className="border-r-4 border-foreground flex flex-col items-center justify-center gap-6 p-8 bg-foreground">
        <LogoIcon size={100} />
        <h1 className="font-brand font-bold text-background text-5xl text-center">Conduit8</h1>
        <div className="w-full h-1 bg-[rgb(251,146,60)]"></div>
        <p className="font-brand text-background text-xl text-center">AI that Gets Shit Done</p>
      </div>

      {/* Panel 3 */}
      <div className="flex flex-col items-center justify-center gap-4 p-8 bg-background">
        <div className="text-8xl">✅</div>
        <p className="font-brand font-bold text-foreground text-2xl text-center">Shipped Feature</p>
      </div>
    </div>
  </div>
);

// 3. Terminal Style - Code aesthetic
const Card3Terminal = () => (
  <div
    className="relative flex flex-col bg-foreground p-12"
    style={{ width: OG_WIDTH, height: OG_HEIGHT }}
  >
    {/* Terminal header */}
    <div className="flex items-center gap-2 mb-8">
      <div className="flex gap-2">
        <div className="w-4 h-4 rounded-full bg-[rgb(251,146,60)]"></div>
        <div className="w-4 h-4 rounded-full border-2 border-background"></div>
        <div className="w-4 h-4 rounded-full border-2 border-background"></div>
      </div>
      <span className="font-brand text-background text-xl ml-4">conduit8.dev</span>
    </div>

    {/* Terminal content */}
    <div className="flex-1 flex flex-col gap-6 font-mono text-background">
      <div className="flex items-center gap-3">
        <span className="text-[rgb(251,146,60)] text-3xl">$</span>
        <span className="text-3xl">conduit8 --help</span>
      </div>

      <div className="flex flex-col gap-4 ml-8 text-2xl">
        <div className="flex gap-4">
          <span className="text-[rgb(251,146,60)]">›</span>
          <span>Claude Code in Slack</span>
        </div>
        <div className="flex gap-4">
          <span className="text-[rgb(251,146,60)]">›</span>
          <span>Powered by Anthropic</span>
        </div>
        <div className="flex gap-4">
          <span className="text-[rgb(251,146,60)]">›</span>
          <span>Extended with MCPs</span>
        </div>
      </div>

      <div className="flex-1"></div>

      <div className="flex items-center gap-3">
        <span className="text-[rgb(251,146,60)] text-3xl">$</span>
        <span className="text-3xl">Add to Slack</span>
        <div className="w-4 h-8 bg-background animate-pulse ml-1"></div>
      </div>
    </div>
  </div>
);

// 4. Bold Statement - Large typography focus
const Card4BoldStatement = () => (
  <div
    className="relative flex flex-col justify-between bg-background border-4 border-foreground p-16"
    style={{ width: OG_WIDTH, height: OG_HEIGHT }}
  >
    <div className="flex items-center gap-4">
      <LogoIcon size={60} />
      <span className="font-brand font-bold text-foreground text-3xl">Conduit8</span>
    </div>

    <div className="flex flex-col gap-6">
      <h1 className="font-brand font-bold text-foreground text-6xl leading-none max-w-4xl">
        Turn messages into{' '}
        <span className="relative inline-block">
          completed work
          <div className="absolute bottom-0 left-0 right-0 h-8 bg-[rgb(251,146,60)]/30 -z-10"></div>
        </span>
      </h1>
      <div className="flex gap-8 font-brand text-muted-foreground text-2xl">
        <span>Extended with MCPs</span>
        <span>•</span>
        <span>Powered by Claude Code</span>
      </div>
    </div>

    <div className="flex justify-between items-end">
      <span className="font-brand text-muted-foreground text-2xl">conduit8.dev</span>
      <div className="flex items-center gap-2">
        <span className="font-brand text-muted-foreground text-xl">Free to try</span>
        <div className="w-3 h-3 rounded-full bg-[rgb(251,146,60)]"></div>
      </div>
    </div>
  </div>
);

// 5. Split Screen - Asymmetric layout
const Card5SplitScreen = () => (
  <div
    className="relative flex bg-background"
    style={{ width: OG_WIDTH, height: OG_HEIGHT }}
  >
    {/* Left side - Dark with logo */}
    <div className="w-2/5 bg-foreground flex flex-col items-center justify-center gap-8 p-12 border-4 border-foreground">
      <LogoIcon size={140} />
      <div className="w-full h-2 bg-[rgb(251,146,60)]"></div>
      <div className="flex flex-col gap-2 text-center">
        <span className="font-brand text-background text-xl">Powered by</span>
        <span className="font-brand font-bold text-background text-3xl">Claude Code</span>
      </div>
    </div>

    {/* Right side - Light with text */}
    <div className="flex-1 flex flex-col justify-center gap-8 p-16 border-y-4 border-r-4 border-foreground">
      <div>
        <h1 className="font-brand font-bold text-foreground text-7xl mb-4">Conduit8</h1>
        <div className="w-32 h-1 bg-[rgb(251,146,60)]"></div>
      </div>

      <div className="flex flex-col gap-4 text-3xl font-brand text-muted-foreground">
        <div className="flex items-center gap-3">
          <div className="w-2 h-2 bg-foreground"></div>
          <span>Turn Slack messages into shipped features</span>
        </div>
        <div className="flex items-center gap-3">
          <div className="w-2 h-2 bg-foreground"></div>
          <span>Extend with MCPs</span>
        </div>
        <div className="flex items-center gap-3">
          <div className="w-2 h-2 bg-foreground"></div>
          <span>BYOK Anthropic key</span>
        </div>
      </div>

      <div className="flex items-center gap-3 mt-8">
        <span className="font-brand font-bold text-foreground text-2xl">conduit8.dev</span>
        <div className="flex-1 h-px bg-border"></div>
      </div>
    </div>
  </div>
);

const meta = {
  title: 'Design System/Social Cards',
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta;

export default meta;

export const SocialCardShowcase = () => {
  const cards = [
    {
      component: Card1MinimalCenter,
      name: '1. Minimal Center',
      description: 'Clean, spacious, professional. Best for general use.',
      pros: 'Maximum readability, works everywhere',
      cons: 'Less distinctive, might blend in'
    },
    {
      component: Card2ComicPanel,
      name: '2. Comic Panel Grid',
      description: 'Graphic novel aesthetic with visual storytelling.',
      pros: 'Tells a story, very on-brand',
      cons: 'Complex, might be too busy'
    },
    {
      component: Card3Terminal,
      name: '3. Terminal Style',
      description: 'Developer-focused code/terminal aesthetic.',
      pros: 'Speaks to developers, unique',
      cons: 'Might alienate non-technical users'
    },
    {
      component: Card4BoldStatement,
      name: '4. Bold Statement',
      description: 'Large typography, confident messaging.',
      pros: 'High impact, memorable',
      cons: 'Bold language might not suit all contexts'
    },
    {
      component: Card5SplitScreen,
      name: '5. Split Screen',
      description: 'Asymmetric layout with visual hierarchy.',
      pros: 'Balanced, professional yet distinctive',
      cons: 'Slightly more complex'
    },
  ];

  return (
    <div className="space-y-16 p-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">Social Card / OG Image Concepts</h1>
        <p className="text-muted-foreground mb-2">5 design directions for your Open Graph / social sharing images (1200x630px)</p>
        <small className="text-muted-foreground">
          These appear when sharing links on Twitter, LinkedIn, Slack, Discord, etc.
        </small>
      </div>

      {/* Full size previews */}
      <div className="space-y-12">
        {cards.map((card, i) => {
          const CardComponent = card.component;
          return (
            <div key={i} className="space-y-4">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-2xl font-bold mb-2">{card.name}</h2>
                  <p className="text-muted-foreground mb-2">{card.description}</p>
                  <div className="flex gap-6 text-sm">
                    <div>
                      <span className="text-green-600 font-semibold">✓ Pros:</span>{' '}
                      <span className="text-muted-foreground">{card.pros}</span>
                    </div>
                    <div>
                      <span className="text-amber-600 font-semibold">⚠ Cons:</span>{' '}
                      <span className="text-muted-foreground">{card.cons}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="border-border rounded-lg border overflow-hidden" style={{ maxWidth: 1200 }}>
                <CardComponent />
              </div>
            </div>
          );
        })}
      </div>

      {/* Scaled down grid view */}
      <div>
        <h2 className="text-2xl font-bold mb-6">Side by Side Comparison (50% scale)</h2>
        <div className="grid grid-cols-2 gap-6">
          {cards.map((card, i) => {
            const CardComponent = card.component;
            return (
              <div key={i} className="space-y-2">
                <div className="border-border rounded overflow-hidden" style={{ transform: 'scale(0.5)', transformOrigin: 'top left', width: OG_WIDTH * 2, height: OG_HEIGHT * 2 }}>
                  <CardComponent />
                </div>
                <p className="text-sm font-medium" style={{ marginTop: OG_HEIGHT * 0.5 }}>{card.name}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Recommendations */}
      <div className="border-border bg-accent-muted rounded-lg border p-8">
        <h2 className="text-2xl font-bold mb-4">Recommendations</h2>
        <div className="space-y-4 text-sm">
          <div>
            <strong className="text-accent">Best Overall:</strong>
            <p className="text-muted-foreground">#5 Split Screen - Professional, distinctive, balanced. Works in all contexts.</p>
          </div>
          <div>
            <strong className="text-accent">Most On-Brand:</strong>
            <p className="text-muted-foreground">#2 Comic Panel - Graphic novel aesthetic shines. Best for product launch.</p>
          </div>
          <div>
            <strong className="text-accent">Best for Developers:</strong>
            <p className="text-muted-foreground">#3 Terminal - Speaks directly to technical audience. Great for dev communities.</p>
          </div>
          <div>
            <strong className="text-accent">Most Versatile:</strong>
            <p className="text-muted-foreground">#1 Minimal Center - Clean, safe, readable. Use when in doubt.</p>
          </div>
          <div>
            <strong className="text-accent">Highest Impact:</strong>
            <p className="text-muted-foreground">#4 Bold Statement - Confident, memorable. Best for marketing campaigns.</p>
          </div>
          <div className="pt-4 border-t border-border mt-6">
            <strong className="text-accent">My Top Pick:</strong>
            <p className="text-muted-foreground"><strong>#5 Split Screen or #2 Comic Panel</strong> - Split Screen for professional contexts (LinkedIn, Product Hunt), Comic Panel for brand-building (Twitter, blog). Both align with your graphic novel aesthetic while being distinct and memorable.</p>
          </div>
        </div>
      </div>
    </div>
  );
};
