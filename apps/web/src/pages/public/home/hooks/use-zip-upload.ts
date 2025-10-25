import { useState } from 'react';

import type { ParsedSkillZip } from '../utils/parse-skill-zip';

import { parseSkillZip } from '../utils/parse-skill-zip';

/**
 * Hook for managing ZIP file upload and parsing
 */
export function useZipUpload() {
  const [zipFile, setZipFile] = useState<File | null>(null);
  const [parsedZip, setParsedZip] = useState<ParsedSkillZip | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleUpload = async (file: File) => {
    setIsLoading(true);
    setError(null);
    setZipFile(file);

    try {
      const parsed = await parseSkillZip(file);
      setParsedZip(parsed);
    }
    catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to parse ZIP file';
      setError(errorMessage);
      setParsedZip(null);
    }
    finally {
      setIsLoading(false);
    }
  };

  const reset = () => {
    setZipFile(null);
    setParsedZip(null);
    setError(null);
    setIsLoading(false);
  };

  return {
    zipFile,
    parsedZip,
    isLoading,
    error,
    handleUpload,
    reset,
  };
}
