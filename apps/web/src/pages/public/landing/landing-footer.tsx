import { Link } from '@tanstack/react-router';

import { Logo } from '@web/ui/components/atoms/brand/logo';

export const LandingFooter = () => {
  return (
    <footer className="bg-gray-12 text-background relative overflow-hidden">
      <div className="px-4 py-12 container-max-w-6xl">
        <div className="px-4">
          <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-8">
            {/* Left: Brand + Made by */}
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <Logo variant="text" size="md" interactive={false} />
                <small className="text-background">Turn threads into completed work</small>
              </div>
              <small className="text-background/70">
                Made by
                {' '}
                <a
                  href="https://github.com/alexander-zuev"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-background transition-colors"
                >
                  AZ
                </a>
              </small>
            </div>

            {/* Right: Legal links */}
            <div className="flex flex-col gap-2 md:text-right">
              <Link
                to="/privacy"
                className="text-sm text-background/70 hover:text-background transition-colors"
              >
                Privacy
              </Link>
              <Link
                to="/terms"
                className="text-sm text-background/70 hover:text-background transition-colors"
              >
                Terms
              </Link>
            </div>

          </div>
        </div>
      </div>

      <div id="separator" className="hidden md:block md:py-32"></div>

      {/* Large Kollektiv watermark text */}
      <div
        className="absolute inset-x-0 pointer-events-none select-none overflow-hidden hidden md:block"
        style={{ bottom: '-5vw' }}
      >
        <div className="relative flex justify-center w-full">
          <span
            className="font-mono font-bold tracking-[0.1em] bg-gradient-to-b from-background/10 to-transparent bg-clip-text text-transparent whitespace-nowrap"
            style={{ fontSize: '15vw', lineHeight: '1' }}
            aria-hidden="true"
          >
            Kollektiv
          </span>
        </div>
      </div>
    </footer>
  );
};
