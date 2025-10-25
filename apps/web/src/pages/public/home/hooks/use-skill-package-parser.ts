import { useState } from 'react';

import { SkillPackage } from '../models/skill-package';

/**
 * Result of parsing a skill package file
 */
type ParseResult =
  | { success: true }
  | { success: false; error: string };

/**
 * Hook for managing skill package parsing state
 * Wraps SkillPackage domain model with React state
 */
export function useSkillPackageParser() {
  const [skillPackage, setSkillPackage] = useState<SkillPackage | null>(null);
  const [isParsing, setIsParsing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const parseFile = async (file: File): Promise<ParseResult> => {
    setIsParsing(true);
    setError(null);

    try {
      const pkg = await SkillPackage.fromFile(file);
      setSkillPackage(pkg);
      return { success: true };
    }
    catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to parse ZIP file';
      setError(errorMessage);
      setSkillPackage(null);
      return { success: false, error: errorMessage };
    }
    finally {
      setIsParsing(false);
    }
  };

  const reset = () => {
    setSkillPackage(null);
    setError(null);
    setIsParsing(false);
  };

  return {
    skillPackage,
    isParsing,
    error,
    parseFile,
    reset,
  };
}
