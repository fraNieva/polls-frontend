import { useEffect } from "react";
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
}

/**
 * Hook for managing post-authentication navigation
 *
 * @param options - Configuration options for redirect behavior
 *
 * @example
 * ```tsx
 * // In LoginPage component
 * useAuthRedirect({ defaultPath: '/dashboard' });
 * ```
 */
export const useAuthRedirect = (options: UseAuthRedirectOptions = {}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated } = useAppSelector((state) => state.auth);

  const { defaultPath = "/polls", replace = true } = options;

  useEffect(() => {
    if (isAuthenticated) {
      const redirectPath = getRedirectPath(location.state, defaultPath);
      navigate(redirectPath, { replace });
    }
  }, [isAuthenticated, navigate, location.state, defaultPath, replace]);
};
