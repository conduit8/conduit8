import type { SkillCategory } from '@conduit8/core';

import {
  BriefcaseIcon,
  ChartBarIcon,
  CodeIcon,
  FileTextIcon,
  MegaphoneIcon,
  PaintBrushIcon,
  PencilIcon,
} from '@phosphor-icons/react';

/**
 * Icon mapping for skill categories
 * Shared across submit form and skill cards
 */
export const SKILL_CATEGORY_ICONS: Record<SkillCategory, typeof CodeIcon> = {
  development: CodeIcon,
  content: PencilIcon,
  documents: FileTextIcon,
  data: ChartBarIcon,
  design: PaintBrushIcon,
  marketing: MegaphoneIcon,
  business: BriefcaseIcon,
};

/**
 * Human-readable labels for skill categories
 */
export const SKILL_CATEGORY_LABELS: Record<SkillCategory, string> = {
  development: 'Development',
  content: 'Content',
  documents: 'Documents',
  data: 'Data',
  design: 'Design',
  marketing: 'Marketing',
  business: 'Business',
};
