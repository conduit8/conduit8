import type { AuthUser } from '@web/lib/auth/models';

import { useNavigate } from '@tanstack/react-router';
import * as sections from '@web/pages/public/home/components';
import { SignInModal } from '@web/pages/public/home/components/sign-in-modal';
import { useDeferredValue, useMemo, useState } from 'react';

import { PageLayout } from '@web/ui/components/layout/page/page-layout';

import { HomeFooter } from './home-footer';
import { HomeHeader } from './home-header';
import { useSkillsList } from './hooks/use-skills-list';

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
  const filteredSkills = useMemo(() => {
    // Return empty during loading - SkillsBrowseSection handles loading state
    if (!data?.data)
      return [];

    let result = [...data.data];

    // Category filter
    if (selectedCategories.length > 0) {
      result = result.filter(skill => skill.category && selectedCategories.includes(skill.category));
    }

    // Source filter
    if (selectedSources.length > 0) {
      result = result.filter(skill => selectedSources.includes(skill.authorKind));
    }

    // Sort
    result.sort((a, b) => {
      switch (sortBy) {
        case 'downloads':
          return b.downloadCount - a.downloadCount;
        case 'recent':
          return 0; // TODO: Need createdAt timestamp
        case 'az':
          return a.name.localeCompare(b.name);
        case 'za':
          return b.name.localeCompare(a.name);
        default:
          return 0;
      }
    });

    return result;
  }, [data?.data, selectedCategories, selectedSources, sortBy]);

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
