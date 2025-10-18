import { AuthUser } from '@web/lib/auth/models/auth-user';
import { authClient } from '@web/lib/clients/auth.client';

type UseAuthReturn = {
  isLoading: boolean;
  isAuthenticated: boolean;
} & (
  | { user: AuthUser; error: null } // Success: user exists, no error
  | { user: null; error: Error } // Error: no user, error exists
  | { user: null; error: null } // No user, no error (not logged in)
);

/**
 * Hook to get the current authenticated user
 * Returns domain model with UI-friendly methods
 *
 * Return type enforces mutual exclusivity:
 * - Error state: error exists, user is null
 * - Authenticated: user exists, error is null
 * - Not authenticated: both null
 */
export const useAuth = (): UseAuthReturn => {
  const session = authClient.useSession();

  const isLoading = session?.isPending ?? false;
  const error = session?.error ?? null;
  const userData = session?.data?.user;

  if (error) {
    return {
      user: null,
      error,
      isLoading,
      isAuthenticated: false,
    };
  }

  if (userData) {
    return {
      user: new AuthUser(userData),
      error: null,
      isLoading,
      isAuthenticated: true,
    };
  }

  // Not logged in (no error, no user)
  return {
    user: null,
    error: null,
    isLoading,
    isAuthenticated: false,
  };
};
