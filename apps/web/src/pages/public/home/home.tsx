import type { AuthUser } from '@web/lib/auth/models';

import { useNavigate } from '@tanstack/react-router';
import * as sections from '@web/pages/public/home/components';
import { SignInModal } from '@web/pages/public/home/components/sign-in-modal';
import { useDeferredValue, useState } from 'react';

import { PageLayout } from '@web/ui/components/layout/page/page-layout';

import { HomeFooter } from './home-footer';
import { HomeHeader } from './home-header';
import { useSkillsFilter, useSkillsList } from './hooks';

interface LandingPageProps {
  user: AuthUser | null;
  loginModal: any;
}

export function HomePage({ user, loginModal }: LandingPageProps) {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState('downloads');
  const [selectedSources, setSelectedSources] = useState<string[]>([]);

  // Defer search query for better input responsiveness
  const deferredSearchQuery = useDeferredValue(searchQuery);
  const isSearchPending = searchQuery !== deferredSearchQuery;

  // Fetch skills from API with search query
  const { data, isLoading } = useSkillsList({
    q: deferredSearchQuery.trim() || undefined,
    limit: 100,
    offset: 0,
  });

  // Client-side filter and sort (category, source, sort not supported by API yet)
  const filteredSkills = useSkillsFilter(data?.data, {
    categories: selectedCategories,
    sources: selectedSources,
    sortBy,
  });

  const handleSkillClick = (skillId: string) => {
    // TODO: Navigate to skill detail page when implemented
    console.log('Skill clicked:', skillId);
  };

  const handleSubmitClick = () => {
    if (user) {
      // TODO: Open submit skill dialog when implemented
      console.log('Open submit dialog');
    }
    else {
      loginModal.open();
    }
  };

  return (
    <>
      <PageLayout
        header={<HomeHeader user={user} loginModal={loginModal} onSubmitClick={handleSubmitClick} />}
        footer={<HomeFooter />}
        variant="full-width"
        contentPadding={false}
      >
        <sections.HeroSection />
        <sections.SkillsBrowseSection
          skills={filteredSkills}
          onSkillClick={handleSkillClick}
          isPending={isLoading || isSearchPending}
          onSubmitClick={handleSubmitClick}
          onSearchChange={setSearchQuery}
          selectedCategories={selectedCategories}
          onCategoryChange={setSelectedCategories}
          sortBy={sortBy}
          onSortChange={setSortBy}
          selectedSources={selectedSources}
          onSourceChange={setSelectedSources}
        />
      </PageLayout>

      <SignInModal
        open={loginModal.isOpen}
        onOpenChange={open => open ? loginModal.open() : loginModal.close()}
      />
    </>
  );
}
