import { ListIcon, PlusIcon } from '@phosphor-icons/react';
import { useAuth } from '@web/lib/auth/hooks';
import { useIsMobile } from '@web/lib/hooks';
import { useGitHubStars, useScrollDetection } from '@web/pages/public/home/hooks';
import { UnstyledLink } from '@web/ui/components/navigation';
import { UserDropdownMenu } from '@web/ui/components/overlays/user-dropdown';
import { useState } from 'react';
import { FaGithub } from 'react-icons/fa6';

import { Logo } from '@web/ui/components/atoms/brand/logo';
import { Button } from '@web/ui/components/atoms/buttons/button';
import { Skeleton } from '@web/ui/components/feedback/progress/skeleton';
import {
  Sheet,
  SheetContent,
  SheetHeader,
} from '@web/ui/components/overlays/sheet';

interface HomeHeaderProps {
  user: any;
  loginModal: any;
  onSubmitClick?: () => void;
}

export function HomeHeader({
  user,
  loginModal,
  onSubmitClick,
}: HomeHeaderProps) {
  const { isLoading } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const isMobile = useIsMobile();
  const hasScrolled = useScrollDetection();
  const { data: stars, isLoading: starsLoading } = useGitHubStars();

  const handleSubmitClick = () => {
    if (user && onSubmitClick) {
      onSubmitClick();
    }
    else if (!user) {
      loginModal.open();
    }
  };

  return (
    <header
      className={`r sticky top-2 z-50 ${
        isMobile
          ? 'mx-2 rounded-md' // Mobile: sharper radius
          : 'mx-auto w-full rounded-md transition-[max-width] duration-500' // Desktop: sharper radius
      } ${
        hasScrolled
          ? `bg-surface border-border border ${isMobile ? '' : 'max-w-6xl'}`
          : !isMobile
              ? 'max-w-6xl'
              : ''
      } `}
    >
      <div
        className={`flex items-center ${isMobile ? 'justify-center py-2 px-2 relative' : 'justify-between py-4 px-6'} `}
      >
        <Logo variant="text" />

        {isMobile
          ? (
        // Mobile content: Centered Logo + Burger Menu (absolute)
              <>
                <Button
                  variant="ghost"
                  onClick={() => setMobileMenuOpen(true)}
                  className="absolute right-2"
                >
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
                    <div className="flex flex-col gap-3 px-4 py-4">
                      {isLoading
                        ? (
                            <Skeleton className="h-10 w-full" />
                          )
                        : user
                          ? (
                              <>
                                <Button
                                  variant="accent"
                                  asChild
                                  className="w-full justify-start"
                                  onClick={() => setMobileMenuOpen(false)}
                                >
                                  <UnstyledLink to={'/' as any}>
                                    Home
                                  </UnstyledLink>
                                </Button>
                                <Button
                                  variant="outline"
                                  className="w-full justify-start"
                                  onClick={() => {
                                    setMobileMenuOpen(false);
                                    if (onSubmitClick) {
                                      onSubmitClick();
                                    }
                                  }}
                                >
                                  <PlusIcon size={16} weight="fill" />
                                  Submit
                                </Button>
                              </>
                            )
                          : (
                              <Button
                                variant="accent"
                                className="w-full"
                                onClick={() => {
                                  setMobileMenuOpen(false);
                                  handleSubmitClick();
                                }}
                              >
                                <PlusIcon size={16} weight="fill" />
                                Submit
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
                  {/* GitHub Link with Stars */}
                  <Button variant="ghost" size="sm" asChild>
                    <a
                      href="https://github.com/conduit8/conduit8"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 hover:no-underline"
                    >
                      <FaGithub size={18} />
                      <div className="bg-accent-bg text-accent-text rounded-sm px-2 py-0.5 text-xs font-medium">
                        {starsLoading
                          ? (
                              <span>...</span>
                            )
                          : (
                              <span>{stars || 0}</span>
                            )}
                      </div>
                    </a>
                  </Button>

                  {isLoading
                    ? (
                        // Match final DOM structure to prevent layout shift
                        <div className="flex items-center gap-3">
                          <Skeleton className="h-8 w-24" />
                          <Skeleton className="h-8 w-8 rounded-full" />
                        </div>
                      )
                    : (
                        <>
                          <Button variant="accent" size="sm" onClick={handleSubmitClick}>
                            <PlusIcon size={16} weight="fill" className="text-accent" />
                            Submit
                          </Button>
                          {user && <UserDropdownMenu user={user} imageOnly />}
                        </>
                      )}
                </div>
              </>
            )}
      </div>
    </header>
  );
}
