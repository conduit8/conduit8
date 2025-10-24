import { useState } from 'react';

/**
 * Hook to manage submit skill dialog state
 */
export function useSubmitSkillDialog() {
  const [isOpen, setIsOpen] = useState(false);

  const open = () => setIsOpen(true);
  const close = () => setIsOpen(false);

  return {
    isOpen,
    open,
    close,
  };
}
