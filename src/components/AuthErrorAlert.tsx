import { Alert, IconButton } from "@mui/material";

/**
 * Props for the AuthErrorAlert component
 */
export interface AuthErrorAlertProps {
  /** Error message to display */
  error: string | null;
  /** Handler for dismissing the error */
  onDismiss: () => void;
  /** Optional custom margin bottom */
  marginBottom?: number;
  /** Optional severity level */
  severity?: "error" | "warning" | "info" | "success";
}

/**
 * Reusable error alert component for authentication pages
 * Displays dismissible error messages with consistent styling
 *
 * @example
 * ```tsx
 * <AuthErrorAlert
 *   error="Invalid credentials"
 *   onDismiss={() => dispatch(clearError())}
 * />
 * ```
 */
export const AuthErrorAlert = ({
  error,
  onDismiss,
  marginBottom = 3,
  severity = "error",
}: AuthErrorAlertProps) => {
  if (!error) {
    return null;
  }

  return (
    <Alert
      severity={severity}
      sx={{ mb: marginBottom }}
      onClose={onDismiss}
      action={
        <IconButton
          aria-label="close error message"
          color="inherit"
          size="small"
          onClick={onDismiss}
        />
      }
    >
      {error}
    </Alert>
  );
};
