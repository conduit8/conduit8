import { ContentGrid } from '@web/ui/components/layout/content/content-grid';

import type { Skill } from '../data/mock-skills';

import { LandingSectionWrapper } from './landing-section-wrapper';
import { SkillCard } from './skill-card';

interface SkillsGridProps {
  skills: Skill[];
  onSkillClick: (id: string) => void;
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
      <ContentGrid
        columns={3}
        className={`w-full transition-opacity ${isPending ? 'opacity-60' : 'opacity-100'}`}
      >
        {skills.map(skill => (
          <SkillCard
            key={skill.id}
            {...skill}
            onClick={() => onSkillClick(skill.id)}
          />
        ))}
      </ContentGrid>
    </LandingSectionWrapper>
  );
}
