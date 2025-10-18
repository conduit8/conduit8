import { ListIcon } from '@phosphor-icons/react';
import { Link } from '@tanstack/react-router';
import { useAuth } from '@web/lib/auth/hooks';
import { useIsMobile } from '@web/lib/hooks';
import { useScrollDetection } from '@web/pages/public/landing/hooks';
import { UnstyledLink } from '@web/ui/components/navigation';
import { UserDropdownMenu } from '@web/ui/components/overlays/user-dropdown';
import { useState } from 'react';

import { Logo } from '@web/ui/components/atoms/brand/logo';
import { Button } from '@web/ui/components/atoms/buttons/button';
import { ArrowRightIcon } from '@web/ui/components/atoms/icons/arrow-right';
import { Skeleton } from '@web/ui/components/feedback/progress/skeleton';
import { Sheet, SheetContent, SheetHeader } from '@web/ui/components/overlays/sheet';

export function LandingHeader() {
  const { user, isLoading } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const isMobile = useIsMobile();
  const hasScrolled = useScrollDetection();

  return (
    <header
      className={`r sticky top-2 z-50 ${
        isMobile
          ? 'mx-2 rounded-md' // Mobile: sharper radius
          : 'mx-auto w-full rounded-md transition-[max-width] duration-500' // Desktop: sharper radius
      } ${
        hasScrolled
          ? `bg-surface border-border border ${isMobile ? '' : 'max-w-7xl'}`
          : !isMobile
              ? 'max-w-7xl'
              : ''
      } `}
    >
      <div
        className={`flex items-center justify-between px-2 md:px-6 ${isMobile ? 'py-2' : 'py-4'} `}
      >
        <Logo />

        {isMobile
          ? (
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
                      {isLoading
                        ? (
                            <Skeleton className="h-10 w-full" />
                          )
                        : user
                          ? (
                              <Button
                                variant="accent"
                                asChild
                                className="w-full justify-start"
                                onClick={() => setMobileMenuOpen(false)}
                              >
                                <UnstyledLink to={'/dashboard' as any}>Dashboard</UnstyledLink>
                              </Button>
                            )
                          : (
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
            )
          : (
        // Desktop content: Nav + CTA
              <>

                <div id="cta" className="flex items-center gap-3">
                  {isLoading
                    ? (
                        <Skeleton className="h-10 w-32" />
                      )
                    : user
                      ? (
                          <div className="flex gap-2">
                            <Button variant="ghost" asChild>
                              <Link
                                to={'/dashboard' as any}
                                className="flex items-center gap-1 hover:no-underline"
                              >
                                Dashboard
                                <ArrowRightIcon size={18} />
                              </Link>
                            </Button>
                            <UserDropdownMenu user={user} imageOnly />
                          </div>
                        )
                      : (
                          <Button asChild className="gap-2" variant="accent">
                            <a
                              href="https://slack.com/oauth/v2/authorize?client_id=6959503069491.9140053645266&scope=assistant:write,chat:write,commands,im:history,im:write,incoming-webhook,users.profile:read,users:write,channels:history&user_scope="
                              target="_blank"
                              rel="noopener noreferrer"
                              className="hover:no-underline"
                            >
                              Get started
                            </a>
                          </Button>
                        )}
                </div>
              </>
            )}
      </div>
    </header>
  );
}
