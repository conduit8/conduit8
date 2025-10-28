import type { SkillDetail } from '@conduit8/core';

import { ContentGrid } from '@web/ui/components/layout/content/content-grid';

import { LandingSectionWrapper } from './landing-section-wrapper';
import { SkillCard } from './skill-card';

interface SkillsGridProps {
  skills: SkillDetail[];
  onSkillClick: (slug: string) => void;
  isPending?: boolean;
}

export function SkillsGrid({ skills, onSkillClick, isPending = false }: SkillsGridProps) {
  if (skills.length === 0) {
    return (
      <LandingSectionWrapper variant="default">
        <div className="text-center py-12 text-muted-foreground">
          <p>No skills found matching your search.</p>
        </div>
      </LandingSectionWrapper>
    );
  }

  return (
    <LandingSectionWrapper variant="default" className="pt-0">
      <div className="w-full text-left text-sm text-muted-foreground mb-6">
        <span className="font-medium text-foreground">{skills.length}</span>
        {' '}
        {skills.length === 1 ? 'skill' : 'skills'}
      </div>
      <ContentGrid
        columns={3}
        className={`w-full transition-opacity ${isPending ? 'opacity-60' : 'opacity-100'}`}
      >
        {skills.map(skill => (
          <SkillCard
            key={skill.slug}
            {...skill}
            onClick={() => onSkillClick(skill.slug)}
          />
        ))}
      </ContentGrid>
    </LandingSectionWrapper>
  );
}
