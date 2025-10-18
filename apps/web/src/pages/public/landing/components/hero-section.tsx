import type { AuthUser } from '@web/lib/auth/models';

import { Icon } from '@iconify/react';
import { KeyIcon, PlugsConnectedIcon, UserCircleIcon } from '@phosphor-icons/react';
import { Link } from '@tanstack/react-router';
import { cn } from '@web/lib/utils';
import Typewriter from 'typewriter-effect';

import { useVideoLoader } from '@web/pages/public/landing/hooks/use-video-loader';
import { Button } from '@web/ui/components/atoms/buttons/button';

import { LandingBackground } from './landing-background-variants';
import { LandingSectionWrapper } from './landing-section-wrapper';

interface HeroSectionProps {
  user: AuthUser | null;
}

export const HeroSection = ({ user }: HeroSectionProps) => {
  const video = useVideoLoader();

  return (
    <LandingBackground>
      <LandingSectionWrapper
        id="hero"
        className="items-center text-center justify-center relative z-10"
      >
      {/* Hero Content */}
      <div className="max-w-3xl flex flex-col gap-6 animate-in fade-in duration-1000 slide-in-from-bottom-25">
        <h1 className="text-balance text-display-hero ">
          Turn Slack messages into
          <br />
          <span className="relative inline-block">
            {' '}
            <Typewriter
              options={{
                strings: [
                  'shipped features',
                  'merged PRs',
                  'updated docs',
                  'fixed bugs',
                ],
                autoStart: true,
                loop: true,
                delay: 75,
                deleteSpeed: 50,
              }}
            />
            <span className="absolute -left-1 -right-1 bottom-0 h-[35%] bg-accent/30 -z-10"></span>
          </span>
        </h1>
        <p className="text-subtitle text-muted-foreground max-w-2xl text-center md:mx-auto">
          Your AI teammate in Slack. Extended with MCPs.
        </p>
      </div>

      {/* CTA Button */}
      <div className="flex flex-col w-full justify-center items-center gap-4 animate-in fade-in duration-1000 slide-in-from-bottom-25 delay-100 fill-mode-backwards">
        <Button variant="accent" size="lg" className="gap-2" asChild>
          {user
            ? (
                <Link to={'/dashboard' as any} className="hover:no-underline">
                  <>New transcription</>
                </Link>
              )
            : (
                <a
                  href="https://slack.com/oauth/v2/authorize?client_id=6959503069491.9140053645266&scope=assistant:write,chat:write,commands,im:history,im:write,incoming-webhook,users.profile:read,users:write,channels:history&user_scope="
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:no-underline"
                >
                  Add to
                  <Icon icon="logos:slack-icon" className="ml-1 size-5" />

                  {/* <span className={'text-accent-foreground-low-contrast'}> - it's free</span> */}
                </a>
              )}
        </Button>
        <small className="text-muted-foreground">
          {user ? `Signed in as ${user.email}` : ``}
        </small>

        {/* Trust signals */}
        <div className="flex gap-4 md:gap-8 text-sm text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <PlugsConnectedIcon className="w-4 h-4" weight="duotone" />
            MCP support
          </span>
          <span className="flex items-center gap-1.5">
            <KeyIcon className="w-4 h-4" weight="duotone" />
            BYOK key
          </span>
          <span className="flex items-center gap-1.5">
            <UserCircleIcon className="w-4 h-4" weight="duotone" />
            Private & secure
          </span>
        </div>
      </div>

      {/* Video demo block  -> it must be it's own component imo  */}
      <div
        className="relative w-full max-w-4xl mx-auto rounded-lg overflow-hidden border border-foreground bg-surface/50 animate-in fade-in duration-1000 slide-in-from-bottom-25 delay-200 fill-mode-backwards"
        style={{ aspectRatio: '1112/720' }}
      >
        {/* Poster image - always visible as background */}
        <img
          src="/demo/web-demo-poster.jpg"
          alt="Kollektiv demo"
          className="absolute inset-0 w-full h-full object-cover"
          loading="eager"
          fetchPriority="high"
        />

        {/* Video - overlays poster when loaded, hidden on error */}
        {!video.hasError && (
          <video
            className={cn(
              'absolute inset-0 w-full h-full object-cover transition-opacity duration-500',
              video.isLoaded ? 'opacity-100' : 'opacity-0',
            )}
            poster="/demo/web-demo-poster.jpg"
            src="/demo/web-demo.mp4"
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            onLoadedData={video.handlers.onLoadedData}
            onError={video.handlers.onError}
          />
        )}
      </div>
      {/* </div> */}
      </LandingSectionWrapper>
    </LandingBackground>
  );
};
