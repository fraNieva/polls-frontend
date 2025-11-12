import { useState, useCallback } from "react";

/**
 * Custom hook for managing password visibility toggle
 * Provides state and handler for showing/hiding password fields
 */
export interface UsePasswordToggleReturn {
  /** Current password visibility state */
  showPassword: boolean;
  /** Toggle password visibility */
  togglePasswordVisibility: () => void;
  /** Set password visibility directly */
  setShowPassword: (show: boolean) => void;
}

/**
 * Hook for password visibility management
 *
 * @param initialState - Initial visibility state (default: false)
 * @returns Object with showPassword state and toggle function
 *
 * @example
 * ```tsx
 * const { showPassword, togglePasswordVisibility } = usePasswordToggle();
 *
 * <TextField
 *   type={showPassword ? 'text' : 'password'}
 *   slotProps={{
 *     input: {
 *       endAdornment: (
 *         <IconButton onClick={togglePasswordVisibility}>
 *           {showPassword ? <VisibilityOff /> : <Visibility />}
 *         </IconButton>
 *       )
 *     }
 *   }}
 * />
 * ```
 */
export const usePasswordToggle = (
  initialState = false
): UsePasswordToggleReturn => {
  const [showPassword, setShowPassword] = useState(initialState);

  const togglePasswordVisibility = useCallback(() => {
    setShowPassword((prev) => !prev);
  }, []);

  return {
    showPassword,
    togglePasswordVisibility,
    setShowPassword,
  };
};
