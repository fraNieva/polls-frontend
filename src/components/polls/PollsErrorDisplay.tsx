import { AlertMessage } from "../common/AlertMessage";

interface PollsErrorDisplayProps {
  error: string;
  onRetry: () => void;
  maxWidth?: number;
}

/**
 * Error display component with retry functionality
 * Shows user-friendly error messages and retry button
 */
export const PollsErrorDisplay = ({
  error,
  onRetry,
  maxWidth = 600,
}: PollsErrorDisplayProps) => {
  return (
    <AlertMessage
      severity="error"
      title="Failed to load polls"
      message={error || "Something went wrong. Please try again."}
      actionButton={{
        text: "Try Again",
        onClick: onRetry,
      }}
      maxWidth={maxWidth}
      centered
    />
  );
};
