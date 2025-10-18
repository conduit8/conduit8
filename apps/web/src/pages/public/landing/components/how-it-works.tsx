import { CloudArrowDownIcon, MagicWandIcon, PlugsConnectedIcon } from '@phosphor-icons/react';

import { FeatureBlock } from './feature-block';
import { LandingSectionWrapper } from './landing-section-wrapper';
import { SectionHeader } from './section-header';
import { McpConnectionsVisual, SlackInstallVisual, SlackToPrVisual } from './visuals';

export const HowItWorksSection = () => {
  return (
    <LandingSectionWrapper background="surface">
      <SectionHeader
        label="How it works"
        title="Three simple steps"
        description="From Slack to production in minutes. Just make sure your main branch is protected."
      />

      {/* Three steps */}
      <div className="grid max-w-5xl gap-12 md:grid-cols-3 md:mx-auto">
        <FeatureBlock
          icon={<CloudArrowDownIcon className="size-5" />}
          featureName="Step 1"
          title="Add to Slack"
          subtitle="One click install, takes 5 seconds"
          visual={<SlackInstallVisual />}
        />
        <FeatureBlock
          icon={<PlugsConnectedIcon className="size-5" />}
          featureName="Step 2"
          title="Connect your tools"
          subtitle="GitHub, Notion, Linear via MCP"
          visual={<McpConnectionsVisual />}
        />
        <FeatureBlock
          icon={<MagicWandIcon className="size-5" />}
          featureName="Step 3"
          title="Ship from Slack"
          subtitle="@kollektiv fix the login bug → PR in 10 mins"
          visual={<SlackToPrVisual />}
        />

      </div>
    </LandingSectionWrapper>
  );
};
