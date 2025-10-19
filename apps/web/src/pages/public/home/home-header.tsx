import { GithubLogo, ListIcon, Star } from "@phosphor-icons/react";
import { useAuth } from "@web/lib/auth/hooks";
import { useIsMobile } from "@web/lib/hooks";
import { useScrollDetection } from "@web/pages/public/home/hooks";
import { UnstyledLink } from "@web/ui/components/navigation";
import { UserDropdownMenu } from "@web/ui/components/overlays/user-dropdown";
import { useState } from "react";

import { Logo } from "@web/ui/components/atoms/brand/logo";
import { Button } from "@web/ui/components/atoms/buttons/button";
import { Skeleton } from "@web/ui/components/feedback/progress/skeleton";
import {
  Sheet,
  SheetContent,
  SheetHeader,
} from "@web/ui/components/overlays/sheet";

interface LandingHeaderProps {
  user: any;
  loginModal: any;
  onSubmitClick?: () => void;
}

export function LandingHeader({
  user,
  loginModal,
  onSubmitClick,
}: LandingHeaderProps) {
  const { isLoading } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const isMobile = useIsMobile();
  const hasScrolled = useScrollDetection();

  const handleSubmitClick = () => {
    if (user && onSubmitClick) {
      onSubmitClick();
    } else if (!user) {
      loginModal.open();
    }
  };

  return (
    <header
      className={`r sticky top-2 z-50 ${
        isMobile
          ? "mx-2 rounded-md" // Mobile: sharper radius
          : "mx-auto w-full rounded-md transition-[max-width] duration-500" // Desktop: sharper radius
      } ${
        hasScrolled
          ? `bg-surface border-border border ${isMobile ? "" : "max-w-6xl"}`
          : !isMobile
            ? "max-w-6xl"
            : ""
      } `}
    >
      <div
        className={`flex items-center justify-between px-2 md:px-6 ${isMobile ? "py-2" : "py-4"} `}
      >
        <Logo />

        {isMobile ? (
          // Mobile content: Logo + Burger Menu
          <>
            <Button variant="ghost" onClick={() => setMobileMenuOpen(true)}>
              <ListIcon size={20} />
            </Button>

            {/* Mobile Menu Sheet */}
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetContent side="right" className="flex w-80 flex-col">
                {/* Header with Logo */}
                <SheetHeader className="flex flex-row items-center justify-between">
                  <Logo />
                </SheetHeader>

                {/* Bottom CTA */}
                <div className="px-4 py-4">
                  {isLoading ? (
                    <Skeleton className="h-10 w-full" />
                  ) : user ? (
                    <Button
                      variant="accent"
                      asChild
                      className="w-full justify-start"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <UnstyledLink to={"/dashboard" as any}>
                        Dashboard
                      </UnstyledLink>
                    </Button>
                  ) : (
                    <Button
                      asChild
                      className="w-full"
                      variant="accent"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <a
                        href="https://slack.com/oauth/v2/authorize?client_id=6959503069491.9140053645266&scope=assistant:write,chat:write,commands,im:history,im:write,incoming-webhook,users.profile:read,users:write,channels:history&user_scope="
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Get started
                      </a>
                    </Button>
                  )}
                </div>
              </SheetContent>
            </Sheet>
          </>
        ) : (
          // Desktop content: Nav + CTA
          <>
            <div id="cta" className="flex items-center gap-3">
              {/* GitHub Link with Stars */}
              <Button variant="ghost" size="sm" asChild>
                <a
                  href="https://github.com/conduit8/conduit8"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 hover:no-underline"
                >
                  <GithubLogo size={20} weight="fill" />
                  <span>GitHub</span>
                  <div className="bg-accent-bg text-accent-text flex items-center gap-1 rounded-sm px-2 py-0.5 text-xs">
                    <Star size={12} weight="fill" />
                    <span>0</span>
                  </div>
                </a>
              </Button>

              {/* Submit Skill Button */}
              <Button variant="accent" size="sm" onClick={handleSubmitClick}>
                Submit Skill
              </Button>

              {isLoading ? (
                <Skeleton className="h-10 w-32" />
              ) : user ? (
                <UserDropdownMenu user={user} imageOnly />
              ) : null}
            </div>
          </>
        )}
      </div>
    </header>
  );
}
