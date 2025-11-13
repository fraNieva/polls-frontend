import { useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAppSelector } from "../store";
import { getRedirectPath } from "../utils/authUtils";

/**
 * Custom hook for handling authentication redirects
 * Automatically redirects authenticated users to appropriate pages
 */
export interface UseAuthRedirectOptions {
  /** Default redirect path for authenticated users */
  defaultPath?: string;
  /** Whether to replace the current history entry */
  replace?: boolean;
  /** Whether to disable automatic redirect (for login/register pages) */
  disabled?: boolean;
}

/**
 * Hook for managing post-authentication navigation
 *
 * @param options - Configuration options for redirect behavior
 *
 * @example
 * ```tsx
 * // In LoginPage component - disable auto redirect
 * useAuthRedirect({ defaultPath: '/dashboard', disabled: true });
 *
 * // In protected pages - enable auto redirect
 * useAuthRedirect({ defaultPath: '/polls' });
 * ```
 */
export const useAuthRedirect = (options: UseAuthRedirectOptions = {}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, error, isLoading } = useAppSelector(
    (state) => state.auth
  );

  // Track previous authentication state to detect transitions
  const prevAuthState = useRef({ isAuthenticated, error, isLoading });

  const { defaultPath = "/polls", replace = true, disabled = false } = options;

  useEffect(() => {
    console.log("useAuthRedirect effect:", {
      disabled,
      isAuthenticated,
      error,
      isLoading,
      wasNotAuthenticated: !prevAuthState.current.isAuthenticated,
    });

    // Don't redirect if disabled (e.g., on login page)
    if (disabled) {
      console.log("useAuthRedirect: disabled, not redirecting");
      return;
    }

    const wasNotAuthenticated = !prevAuthState.current.isAuthenticated;
    const isNowAuthenticated = isAuthenticated;
    const hasNoError = !error;
    const isNotLoading = !isLoading;

    console.log("useAuthRedirect conditions:", {
      wasNotAuthenticated,
      isNowAuthenticated,
      hasNoError,
      isNotLoading,
    });

    // Only redirect on successful authentication transition
    // (was not authenticated -> now authenticated, no error, not loading)
    if (
      wasNotAuthenticated &&
      isNowAuthenticated &&
      hasNoError &&
      isNotLoading
    ) {
      const redirectPath = getRedirectPath(location.state, defaultPath);
      console.log("useAuthRedirect: redirecting to", redirectPath);
      navigate(redirectPath, { replace });
    }

    // Update previous state
    prevAuthState.current = { isAuthenticated, error, isLoading };
  }, [
    isAuthenticated,
    error,
    isLoading,
    navigate,
    location.state,
    defaultPath,
    replace,
    disabled,
  ]);
};
