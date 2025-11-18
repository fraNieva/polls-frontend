import { Button, Box, CircularProgress } from "@mui/material";

/**
 * Props for the AuthSubmitButton component
 */
export interface AuthSubmitButtonProps {
  /** Whether the form is currently submitting */
  isLoading: boolean;
  /** Text to display when not loading */
  children: React.ReactNode;
  /** Text to display when loading */
  loadingText?: string;
  /** Whether the button is disabled */
  disabled?: boolean;
  /** Button variant */
  variant?: "contained" | "outlined" | "text";
  /** Button color */
  color?: "primary" | "secondary" | "error" | "info" | "success" | "warning";
  /** Button size */
  size?: "small" | "medium" | "large";
  /** Optional click handler for custom submission logic */
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
}

/**
 * Reusable submit button component for authentication forms
 * Displays loading state with spinner and customizable text
 *
 * @example
 * ```tsx
 * <AuthSubmitButton
 *   isLoading={isSubmitting}
 *   loadingText="Signing In..."
 * >
 *   Sign In
 * </AuthSubmitButton>
 * ```
 */
export const AuthSubmitButton = ({
  isLoading,
  children,
  loadingText,
  disabled = false,
  variant = "contained",
  color = "primary",
  size = "large",
  onClick,
}: AuthSubmitButtonProps) => {
  const isDisabled = disabled || isLoading;

  return (
    <Button
      type="submit"
      fullWidth
      variant={variant}
      color={color}
      size={size}
      disabled={isDisabled}
      onClick={onClick}
      sx={{
        py: 1.5,
        fontWeight: 600,
        textTransform: "none",
        fontSize: "1rem",
      }}
    >
      {isLoading ? (
        <Box display="flex" alignItems="center" gap={1}>
          <CircularProgress size={20} color="inherit" />
          {loadingText && <span>{loadingText}</span>}
        </Box>
      ) : (
        children
      )}
    </Button>
  );
};
