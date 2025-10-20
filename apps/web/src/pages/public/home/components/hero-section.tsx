import { CheckCircleIcon, CloudArrowDownIcon, UsersThreeIcon } from '@phosphor-icons/react';

import { CodeBlock } from '@web/ui/components/atoms/code/code-block';
import { AnimatedGridPattern } from '@web/ui/components/atoms/effects/animated-grid-pattern';

import { LandingSectionWrapper } from './landing-section-wrapper';

export function HeroSection() {
  const installCommand = 'npx conduit8 install skill pdf';

  return (
    <LandingSectionWrapper className="relative overflow-hidden">
      <AnimatedGridPattern className="opacity-10" />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center relative z-10">
        {/* Left: Title + Features */}
        <div className="flex flex-col gap-8 text-center lg:text-left">
          <div className="flex flex-col gap-2">
            <h1>Claude Code Superpowers</h1>
            <p className="text-muted-foreground">Hand-tested. One command to install.</p>
          </div>

          <div className="flex flex-col gap-4">
            <div className="flex items-start gap-3">
              <CloudArrowDownIcon size={20} weight="duotone" className="shrink-0 mt-0.5 text-muted-foreground" />
              <div className="flex flex-col gap-1 text-left">
                <p className="text-sm font-medium">One-click install</p>
                <p className="text-xs text-muted-foreground">CLI command, no manual setup</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <CheckCircleIcon size={20} weight="duotone" className="shrink-0 mt-0.5 text-muted-foreground" />
              <div className="flex flex-col gap-1 text-left">
                <p className="text-sm font-medium">Actually works</p>
                <p className="text-xs text-muted-foreground">Hand-tested, not broken repos</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <UsersThreeIcon size={20} weight="duotone" className="shrink-0 mt-0.5 text-muted-foreground" />
              <div className="flex flex-col gap-1 text-left">
                <p className="text-sm font-medium">Verified + Community</p>
                <p className="text-xs text-muted-foreground">Curated from trusted sources</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Code Block */}
        <div className="flex flex-col gap-3">
          <CodeBlock code={installCommand} language="bash" />
          <p className="text-xs text-muted-foreground text-center lg:text-left">
            Install any skill with a single command
          </p>
        </div>
      </div>
    </LandingSectionWrapper>
  );
}
