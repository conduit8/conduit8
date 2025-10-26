import { trackSkillNameUnavailable, trackSkillValidationPassed } from '@web/lib/analytics';
import { useCallback, useEffect, useRef, useState } from 'react';

import type { ValidationCheck } from '../components/submit-skill-dialog/validation-checks';
import type { SkillPackage } from '../models/skill-package';

import { skillsApi } from '../services/skills-api';

const INITIAL_CHECKS: ValidationCheck[] = [
  { label: 'ZIP file size (max 50MB)', state: 'checking' },
  { label: 'SKILL.md frontmatter check', state: 'checking' },
  { label: 'Skill name availability', state: 'checking' },
];

/**
 * Hook for validating skill package after parsing
 * Performs sequential validation: file size → frontmatter → name uniqueness
 */
export function useSkillValidation(skillPackage: SkillPackage | null) {
  const [checks, setChecks] = useState<ValidationCheck[]>(INITIAL_CHECKS);
  const [slug, setSlug] = useState<string | null>(null);
  const [allChecksPass, setAllChecksPass] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const updateCheck = useCallback((index: number, update: Partial<ValidationCheck>) => {
    setChecks(prev => prev.map((check, i) => i === index ? { ...check, ...update } : check));
  }, []);

  const delay = useCallback((ms: number) => {
    return new Promise<void>((resolve) => {
      timeoutRef.current = setTimeout(() => {
        timeoutRef.current = null;
        resolve();
      }, ms);
    });
  }, []);

  useEffect(() => {
    // Cleanup function for timeouts
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (!skillPackage) {
      // Reset state
      setChecks(INITIAL_CHECKS);
      setSlug(null);
      setAllChecksPass(false);
      return;
    }

    // Run validation sequence
    const runValidation = async () => {
      // 1. File size check (already passed if we have a package)
      updateCheck(0, { state: 'checking' });
      await delay(300);
      updateCheck(0, { state: 'success' });
      await delay(200);

      // 2. Frontmatter check (already passed if we have a package)
      updateCheck(1, { state: 'checking' });
      await delay(300);
      updateCheck(1, { state: 'success' });
      await delay(200);

      // 3. Name uniqueness check (API call)
      updateCheck(2, { state: 'checking' });

      try {
        const response = await skillsApi.checkSkillName(skillPackage.getFrontmatter().name);

        if (response.data.available) {
          updateCheck(2, {
            label: `Skill name available: ${response.data.slug}`,
            state: 'success',
          });
          setSlug(response.data.slug);
          await delay(400);
          setAllChecksPass(true);

          // Track successful validation
          trackSkillValidationPassed();
        }
        else {
          updateCheck(2, {
            label: 'Skill name availability',
            state: 'error',
            errorMessage: `Slug "${response.data.slug}" is already taken. Please use a different skill name.`,
          });
          setSlug(response.data.slug);
          setAllChecksPass(false);

          // Track name unavailability
          trackSkillNameUnavailable(response.data.slug);
        }
      }
      catch (error) {
        console.error('[Skill Validation] Failed to check skill name:', error);
        updateCheck(2, {
          label: 'Skill name availability',
          state: 'error',
          errorMessage: 'Failed to check name availability. Please try again.',
        });
        setAllChecksPass(false);
      }
    };

    runValidation();
  }, [skillPackage, updateCheck, delay]);

  return {
    checks,
    slug,
    allChecksPass,
  };
}
