import { LandingSectionWrapper } from './landing-section-wrapper';

export function HeroSection() {
  return (
    <LandingSectionWrapper className="items-center text-center py-12">
      <div className="flex flex-col gap-2">
        <h1>Curated repository of Claude Code skills</h1>
        <p className="text-muted-foreground">Install in one click.</p>
      </div>
    </LandingSectionWrapper>
  );
}
