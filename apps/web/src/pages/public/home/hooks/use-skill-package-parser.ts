import {
  getParsingErrorType,
  trackSkillFileParsingFailed,
  trackSkillFileParsingSucceeded,
} from '@web/lib/analytics';
import { useState } from 'react';

import { SkillPackage } from '@web/pages/shared/models/skill-package';

/**
 * Result of parsing a skill package file
 */
type ParseResult
  = | { success: true }
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

      // Track successful parsing
      const fileSizeMB = file.size / 1024 / 1024;
      const fileCount = pkg.getFiles().length;
      trackSkillFileParsingSucceeded(fileSizeMB, fileCount);

      return { success: true };
    }
    catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to parse ZIP file');
      const errorMessage = error.message;
      setError(errorMessage);
      setSkillPackage(null);

      // Track parsing failure using error object (not message)
      const fileSizeMB = file.size / 1024 / 1024;
      const errorType = getParsingErrorType(error);
      trackSkillFileParsingFailed(errorType, fileSizeMB);

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
