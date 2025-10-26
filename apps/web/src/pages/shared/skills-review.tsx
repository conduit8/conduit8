import type { ListPendingSubmissionsResponse, ListSubmissionsResponse, SubmissionStatus } from '@conduit8/core';

import { SUBMISSION_STATUS } from '@conduit8/core';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@web/lib/auth/hooks';
import { SubmitSkillDialog } from '@web/pages/public/home/components/submit-skill-dialog';
import { useState } from 'react';

import { SkillReviewCard } from '@web/pages/admin/review/components/skill-review-card';
import { HomeHeader } from '@web/pages/public/home/home-header';
import { useLoginModal } from '@web/pages/public/home/hooks/use-login-modal';
import { skillsApi } from '@web/pages/public/home/services/skills-api';
import { PageLayout } from '@web/ui/components/layout/page/page-layout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@web/ui/components/navigation/tabs';

type Skill = ListSubmissionsResponse['data'][number] | ListPendingSubmissionsResponse['data'][number];

/**
 * Reusable content renderer for skill lists
 */
interface SkillListContentProps {
  isLoading: boolean;
  error: Error | null;
  skills: Skill[];
  isAdmin: boolean;
  emptyMessage: string;
}

function SkillListContent({ isLoading, error, skills, isAdmin, emptyMessage }: SkillListContentProps) {
  if (error) {
    return (
      <div className="text-center py-12 border rounded-lg border-destructive">
        <p className="text-destructive">Failed to load submissions. Please try again.</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  if (skills.length === 0) {
    return (
      <div className="text-center py-12 border rounded-lg">
        <p className="text-muted-foreground">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="grid gap-4">
      {skills.map(skill => (
        <SkillReviewCard
          key={skill.slug}
          skill={skill}
          isAdmin={isAdmin}
        />
      ))}
    </div>
  );
}

/**
 * Unified Skills Review Page
 *
 * Adapts based on user role:
 * - Admins: See all skills with tabs (pending/approved/rejected) and approve/reject actions
 * - Users: See only their submissions with status badges (read-only)
 *
 * Backend RLS enforces data filtering
 */
export function SkillsReviewPage() {
  const { user } = useAuth();
  const loginModal = useLoginModal();
  const isAdmin = user?.isAdmin ?? false;

  const [selectedStatus, setSelectedStatus] = useState<SubmissionStatus>(SUBMISSION_STATUS.PENDING_REVIEW);
  const [showSubmitDialog, setShowSubmitDialog] = useState(false);

  // Fetch skills - different endpoints based on role
  const { data, isLoading, error } = useQuery({
    // selectedStatus only used when isAdmin=true, conditional spread is correct
    // eslint-disable-next-line @tanstack/query/exhaustive-deps
    queryKey: ['submissions', isAdmin, ...(isAdmin ? [selectedStatus] : [])],
    queryFn: () => isAdmin
      ? skillsApi.listAdminSubmissions({ status: selectedStatus, limit: 100, offset: 0 })
      : skillsApi.listSubmissions({ limit: 100, offset: 0 }),
  });

  const skills = data?.data ?? [];
  const pendingCount = selectedStatus === SUBMISSION_STATUS.PENDING_REVIEW ? skills.length : 0;

  // Conditional configuration
  const title = isAdmin ? 'Review' : 'My Submissions';
  const subtitle = isAdmin
    ? 'Review and manage skill submissions'
    : 'Track the status of your submitted skills';
  const maxWidth = isAdmin ? 'max-w-6xl' : 'max-w-4xl';

  return (
    <PageLayout
      variant="full-width"
      contentPadding={false}
      header={(
        <HomeHeader
          user={user}
          loginModal={loginModal}
          onSubmitClick={!isAdmin ? () => setShowSubmitDialog(true) : undefined}
        />
      )}
    >
      <div className={`container mx-auto ${maxWidth} py-8 space-y-6`}>
        {/* Header */}
        <div>
          <h1>{title}</h1>
          <p className="text-muted-foreground mt-2">
            {subtitle}
          </p>
        </div>

        {/* Admin: Tabs, User: Plain List */}
        {isAdmin
          ? (
              <Tabs value={selectedStatus} onValueChange={v => setSelectedStatus(v as SubmissionStatus)}>
                <TabsList>
                  <TabsTrigger value={SUBMISSION_STATUS.PENDING_REVIEW} className="w-32">
                    Pending
                    {' '}
                    {pendingCount > 0 && `(${pendingCount})`}
                  </TabsTrigger>
                  <TabsTrigger value={SUBMISSION_STATUS.APPROVED} className="w-32">
                    Approved
                  </TabsTrigger>
                  <TabsTrigger value={SUBMISSION_STATUS.REJECTED} className="w-32">
                    Rejected
                  </TabsTrigger>
                </TabsList>

                <TabsContent value={SUBMISSION_STATUS.PENDING_REVIEW} className="space-y-4 mt-6">
                  <SkillListContent
                    isLoading={isLoading}
                    error={error}
                    skills={skills}
                    isAdmin={true}
                    emptyMessage="No pending skills"
                  />
                </TabsContent>

                <TabsContent value={SUBMISSION_STATUS.APPROVED} className="space-y-4 mt-6">
                  <SkillListContent
                    isLoading={isLoading}
                    error={error}
                    skills={skills}
                    isAdmin={true}
                    emptyMessage="No approved skills"
                  />
                </TabsContent>

                <TabsContent value={SUBMISSION_STATUS.REJECTED} className="space-y-4 mt-6">
                  <SkillListContent
                    isLoading={isLoading}
                    error={error}
                    skills={skills}
                    isAdmin={true}
                    emptyMessage="No rejected skills"
                  />
                </TabsContent>
              </Tabs>
            )
          : (
              <SkillListContent
                isLoading={isLoading}
                error={error}
                skills={skills}
                isAdmin={false}
                emptyMessage="No submissions yet"
              />
            )}

        <SubmitSkillDialog
          open={showSubmitDialog}
          onOpenChange={setShowSubmitDialog}
        />
      </div>
    </PageLayout>
  );
}
