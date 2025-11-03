import type { AuthUser } from '@web/lib/auth/models';

import { trackSubmitButtonClicked } from '@web/lib/analytics';
import * as sections from '@web/pages/public/home/components';
import { SignInModal } from '@web/pages/public/home/components/sign-in-modal';
import { SubmitSkillDialog } from '@web/pages/public/home/components/submit-skill-dialog';

import { DeleteSkillDialog, useDeleteSkillDialog } from '@web/pages/public/home/components/delete-skill-dialog';
import { PageLayout } from '@web/ui/components/layout/page/page-layout';

import { HomeFooter } from './home-footer';
import { HomeHeader } from './home-header';
import { useSkillsBrowse, useSkillsFilter, useSkillsList, useSubmitSkillDialog } from './hooks';

interface LandingPageProps {
  user: AuthUser | null;
  loginModal: any;
}

export function HomePage({ user, loginModal }: LandingPageProps) {
  // Browse state
  const browse = useSkillsBrowse();

  // Submit skill dialog
  const submitSkillDialog = useSubmitSkillDialog();

  // Delete skill dialog
  const deleteSkillDialog = useDeleteSkillDialog();

  // Fetch skills from API (with status filter)
  const { data, isLoading } = useSkillsList({
    q: browse.searchQuery.trim().slice(0, 100) || undefined,
    limit: 100,
    offset: 0,
  });

  // Client-side filter and sort (category, source, sort not supported by API yet)
  const filteredSkills = useSkillsFilter(data?.data, {
    categories: browse.selectedCategories,
    sources: browse.selectedSources,
    sortBy: browse.sortBy,
  });

  const handleSkillClick = (skillId: string) => {
    // TODO: Navigate to skill detail page when implemented
    console.log('Skill clicked:', skillId);
  };

  const handleSubmitClick = () => {
    trackSubmitButtonClicked(!!user);

    if (user) {
      submitSkillDialog.open();
    }
    else {
      loginModal.open();
    }
  };

  const handleDeleteSkill = (slug: string, name: string) => {
    deleteSkillDialog.open(slug, name);
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
          isPending={isLoading && !data}
          onSubmitClick={handleSubmitClick}
          onSearchChange={browse.setSearchQuery}
          selectedCategories={browse.selectedCategories}
          onCategoryChange={browse.setCategories}
          sortBy={browse.sortBy}
          onSortChange={browse.setSortBy}
          selectedSources={browse.selectedSources}
          onSourceChange={browse.setSources}
          onResetFilters={browse.resetFilters}
          hasActiveFilters={browse.hasActiveFilters}
          isAdmin={user?.role === 'admin'}
          onDeleteSkill={handleDeleteSkill}
        />
      </PageLayout>

      <SignInModal
        open={loginModal.isOpen}
        onOpenChange={open => open ? loginModal.open() : loginModal.close()}
      />

      <SubmitSkillDialog
        open={submitSkillDialog.isOpen}
        onOpenChange={open => open ? submitSkillDialog.open() : submitSkillDialog.close()}
      />

      <DeleteSkillDialog
        open={deleteSkillDialog.isOpen}
        onOpenChange={open => open ? undefined : deleteSkillDialog.close()}
        skillSlug={deleteSkillDialog.skillSlug}
        skillName={deleteSkillDialog.skillName}
      />
    </>
  );
}
