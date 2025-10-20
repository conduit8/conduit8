import { Link } from '@tanstack/react-router';

import { Logo } from '@web/ui/components/atoms/brand/logo';

export function HomeFooter() {
  return (
    <footer className="bg-foreground border-t border-border relative overflow-hidden">
      <div className="px-4 py-12 container-max-w-6xl">
        <div className="px-4">
          <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-8">
            {/* Left: Brand + Tagline */}
            <div className="flex flex-col gap-2">
              <Logo variant="text" size="md" interactive={false} />
              <small className="text-muted-foreground">
                Curated Claude Code skills
              </small>
            </div>

            {/* Right: Legal links */}
            <div className="flex flex-col gap-2 md:text-right">
              <Link
                to="/privacy"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Privacy
              </Link>
              <Link
                to="/terms"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Terms
              </Link>
            </div>
          </div>

          {/* Watermark */}
          <div className="mt-8 pt-8 border-t border-border/50 text-center">
            <p className="text-xs text-muted-foreground">
              Built with conduit8 &middot;
              {' '}
              {new Date().getFullYear()}
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
