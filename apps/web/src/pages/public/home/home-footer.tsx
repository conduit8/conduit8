import { Link } from '@tanstack/react-router';

import { Logo } from '@web/ui/components/atoms/brand/logo';

export function HomeFooter() {
  return (
    <footer className="bg-foreground text-background relative overflow-hidden">
      <div className="container-max-w-6xl px-4 py-12">
        <div className="px-4">
          <div className="flex flex-col md:flex-row md:justify-between gap-8">
            {/* Left: Brand */}
            <div className="flex flex-col gap-2">
              <Logo variant="text" size="md" interactive={false} />
              <small className="text-background/60">Curated Claude Code skills</small>
            </div>

            {/* Right: Links */}
            <div className="flex gap-12">
              <div className="flex flex-col gap-3">
                <p className="text-background font-semibold text-sm">About</p>
                <a
                  href="mailto:support@conduit8.dev"
                  className="text-background/70 hover:text-background text-sm transition-colors"
                >
                  Support
                </a>
              </div>

              <div className="flex flex-col gap-3">
                <p className="text-background font-semibold text-sm">Legal</p>
                <div className="flex flex-col gap-2">
                  <Link
                    to="/privacy"
                    className="text-background/70 hover:text-background text-sm transition-colors"
                  >
                    Privacy
                  </Link>
                  <Link
                    to="/terms"
                    className="text-background/70 hover:text-background text-sm transition-colors"
                  >
                    Terms
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div id="separator" className="hidden md:block md:py-20"></div>

      {/* Large TYPIST watermark text */}
      <div className="-bottom-30 pointer-events-none absolute inset-x-0 hidden select-none overflow-hidden md:block">
        <div className="relative flex justify-center">
          <span
            className="font-brand from-background/10 bg-gradient-to-b to-transparent bg-clip-text text-[250px] font-bold tracking-[0.1em] text-transparent"
            aria-hidden="true"
          >
            conduit8
          </span>
        </div>
      </div>
    </footer>
  );
}
