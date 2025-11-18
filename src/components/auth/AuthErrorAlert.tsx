import { AlertMessage } from "../common/AlertMessage";

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
  return (
    <AlertMessage
      severity={severity}
      message={error || ""}
      dismissible
      onDismiss={onDismiss}
      marginBottom={marginBottom}
      show={!!error}
    />
  );
};
