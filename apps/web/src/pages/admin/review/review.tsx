import type { SubmissionStatus } from '@conduit8/core';
import { SUBMISSION_STATUS } from '@conduit8/core';

import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@web/lib/auth/hooks';
import { useState } from 'react';
import { HomeHeader } from '@web/pages/public/home/home-header';
import { useLoginModal } from '@web/pages/public/home/hooks/use-login-modal';
import { skillsApi } from '@web/pages/public/home/services/skills-api';
import { PageLayout } from '@web/ui/components/layout/page/page-layout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@web/ui/components/navigation/tabs';

import { SkillDetailDialog } from './components/skill-detail-dialog';
import { SkillReviewCard } from './components/skill-review-card';

/**
 * Admin Review Page
 * Lists all skills by status for admin review
 */
export function AdminReviewPage() {
  const { user } = useAuth();
  const loginModal = useLoginModal();
  const [selectedStatus, setSelectedStatus] = useState<SubmissionStatus>(SUBMISSION_STATUS.PENDING_REVIEW);
  const [selectedSkillSlug, setSelectedSkillSlug] = useState<string | null>(null);

  // Fetch skills by status
  const { data, isLoading, refetch } = useQuery({
    queryKey: ['admin-skills', selectedStatus],
    queryFn: () => skillsApi.listAdminSubmissions({ status: selectedStatus, limit: 100, offset: 0 }),
  });

  const handleViewDetails = (slug: string) => {
    setSelectedSkillSlug(slug);
  };

  const handleCloseDetails = () => {
    setSelectedSkillSlug(null);
    refetch(); // Refresh list after changes
  };

  const skills = data?.data || [];
  const pendingCount = selectedStatus === SUBMISSION_STATUS.PENDING_REVIEW ? skills.length : 0;

  return (
    <PageLayout variant="full-width" contentPadding={false} header={<HomeHeader user={user} loginModal={loginModal} />}>
      <div className="container mx-auto max-w-6xl py-8 space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold">Skills Review</h1>
          <p className="text-muted-foreground mt-2">
            Review and manage skill submissions
          </p>
        </div>

        {/* Tabs */}
        <Tabs value={selectedStatus} onValueChange={v => setSelectedStatus(v as SubmissionStatus)}>
          <TabsList>
            <TabsTrigger value={SUBMISSION_STATUS.PENDING_REVIEW}>
              Pending
              {' '}
              {pendingCount > 0 && `(${pendingCount})`}
            </TabsTrigger>
            <TabsTrigger value={SUBMISSION_STATUS.APPROVED}>
              Approved
            </TabsTrigger>
            <TabsTrigger value={SUBMISSION_STATUS.REJECTED}>
              Rejected
            </TabsTrigger>
          </TabsList>

          {/* Pending Tab */}
          <TabsContent value={SUBMISSION_STATUS.PENDING_REVIEW} className="space-y-4 mt-6">
            {isLoading
              ? (
                  <div className="text-center py-12">
                    <p className="text-muted-foreground">Loading...</p>
                  </div>
                )
              : skills.length === 0
                ? (
                    <div className="text-center py-12 border rounded-lg">
                      <p className="text-muted-foreground">No pending skills</p>
                    </div>
                  )
                : (
                    <div className="grid gap-4">
                      {skills.map(skill => (
                        <SkillReviewCard
                          key={skill.slug}
                          skill={skill}
                          onViewDetails={handleViewDetails}
                        />
                      ))}
                    </div>
                  )}
          </TabsContent>

          {/* Approved Tab */}
          <TabsContent value={SUBMISSION_STATUS.APPROVED} className="space-y-4 mt-6">
            {isLoading
              ? (
                  <div className="text-center py-12">
                    <p className="text-muted-foreground">Loading...</p>
                  </div>
                )
              : skills.length === 0
                ? (
                    <div className="text-center py-12 border rounded-lg">
                      <p className="text-muted-foreground">No approved skills</p>
                    </div>
                  )
                : (
                    <div className="grid gap-4">
                      {skills.map(skill => (
                        <SkillReviewCard
                          key={skill.slug}
                          skill={skill}
                          onViewDetails={handleViewDetails}
                        />
                      ))}
                    </div>
                  )}
          </TabsContent>

          {/* Rejected Tab */}
          <TabsContent value={SUBMISSION_STATUS.REJECTED} className="space-y-4 mt-6">
            {isLoading
              ? (
                  <div className="text-center py-12">
                    <p className="text-muted-foreground">Loading...</p>
                  </div>
                )
              : skills.length === 0
                ? (
                    <div className="text-center py-12 border rounded-lg">
                      <p className="text-muted-foreground">No rejected skills</p>
                    </div>
                  )
                : (
                    <div className="grid gap-4">
                      {skills.map(skill => (
                        <SkillReviewCard
                          key={skill.slug}
                          skill={skill}
                          onViewDetails={handleViewDetails}
                        />
                      ))}
                    </div>
                  )}
          </TabsContent>
        </Tabs>

        {/* Detail Dialog */}
        {selectedSkillSlug && (
          <SkillDetailDialog
            slug={selectedSkillSlug}
            open={!!selectedSkillSlug}
            onClose={handleCloseDetails}
          />
        )}
      </div>
    </PageLayout>
  );
}
