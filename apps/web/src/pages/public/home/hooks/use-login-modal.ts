import { useLocation, useNavigate } from '@tanstack/react-router';
import { useLayoutEffect, useState } from 'react';

interface UseLoginModalReturn {
  isOpen: boolean;
  open: () => void;
  close: () => void;
  originalDestination: string | null;
}

/**
 * Manages login modal state with redirect detection
 *
 * Handles two triggers:
 * 1. Manual: User clicks sign in button
 * 2. Automatic: Redirected from protected route with ?redirect param
 */
export const useLoginModal = (): UseLoginModalReturn => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  // Check for redirect param on mount/change
  useLayoutEffect(() => {
    if (location.search?.redirect) {
      setIsOpen(true);

      // Clear the redirect param from URL to prevent re-triggering
      navigate({
        to: location.pathname,
        search: {},
        replace: true,
      });
    }
  }, [location.search?.redirect, location.pathname, navigate]);

  return {
    isOpen,
    open: () => setIsOpen(true),
    close: () => setIsOpen(false),
    originalDestination: localStorage.getItem('auth_redirect'),
  };
};
