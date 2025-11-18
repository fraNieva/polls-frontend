import {
  Alert,
  AlertTitle,
  Typography,
  Button,
  IconButton,
} from "@mui/material";
import { Link } from "react-router-dom";

/**
 * Action button configuration
 */
export interface AlertActionButton {
  /** Button text */
  text: string;
  /** Click handler */
  onClick: () => void;
  /** Button variant */
  variant?: "text" | "outlined" | "contained";
}

/**
 * Link configuration
 */
export interface AlertLink {
  /** Link text */
  text: string;
  /** Link destination */
  to: string;
  /** Whether to make the link bold */
  bold?: boolean;
}

/**
 * Props for AlertMessage component
 */
export interface AlertMessageProps {
  /** Alert severity/type */
  severity?: "error" | "warning" | "info" | "success";
  /** Main message to display */
  message: string | React.ReactNode;
  /** Optional title/heading */
  title?: string;
  /** Whether the alert can be dismissed */
  dismissible?: boolean;
  /** Handler for dismissing the alert */
  onDismiss?: () => void;
  /** Optional action button */
  actionButton?: AlertActionButton;
  /** Optional inline link within message */
  inlineLink?: AlertLink;
  /** Custom margin bottom */
  marginBottom?: number;
  /** Max width for the alert */
  maxWidth?: number | string;
  /** Center the alert horizontally */
  centered?: boolean;
  /** Whether to show the alert (for conditional rendering) */
  show?: boolean;
}

/**
 * Generic Alert Message Component
 * Unified component for displaying alerts with various configurations
 *
 * @example
 * ```tsx
 * // Error alert with dismiss
 * <AlertMessage
 *   severity="error"
 *   message="Invalid credentials"
 *   dismissible
 *   onDismiss={() => clearError()}
 * />
 *
 * // Info alert with inline link
 * <AlertMessage
 *   severity="info"
 *   message="Please sign in to vote on this poll"
 *   inlineLink={{ text: "sign in", to: "/login", bold: true }}
 * />
 *
 * // Error with retry button
 * <AlertMessage
 *   severity="error"
 *   title="Failed to load polls"
 *   message="Something went wrong. Please try again."
 *   actionButton={{ text: "Try Again", onClick: handleRetry }}
 * />
 * ```
 */
export const AlertMessage = ({
  severity = "info",
  message,
  title,
  dismissible = false,
  onDismiss,
  actionButton,
  inlineLink,
  marginBottom = 3,
  maxWidth,
  centered = false,
  show = true,
}: AlertMessageProps) => {
  // Don't render if show is false or message is empty
  if (!show || !message) {
    return null;
  }

  // Render message with inline link if provided
  const renderMessage = () => {
    if (inlineLink && typeof message === "string") {
      // Split message by the link text
      const parts = message.split(inlineLink.text);

      return (
        <Typography variant="body2">
          {parts[0]}
          <Link
            to={inlineLink.to}
            style={{
              color: "inherit",
              fontWeight: inlineLink.bold ? "bold" : "normal",
            }}
          >
            {inlineLink.text}
          </Link>
          {parts[1]}
        </Typography>
      );
    }

    // If message is a string, wrap in Typography
    if (typeof message === "string") {
      return <Typography variant="body2">{message}</Typography>;
    }

    // Otherwise, render as-is (for React nodes)
    return message;
  };

  // Build action prop for MUI Alert
  let alertAction: React.ReactNode = undefined;

  if (dismissible && onDismiss) {
    alertAction = (
      <IconButton
        aria-label="close alert"
        color="inherit"
        size="small"
        onClick={onDismiss}
      />
    );
  } else if (actionButton) {
    alertAction = (
      <Button
        color="inherit"
        size="small"
        variant={actionButton.variant || "text"}
        onClick={actionButton.onClick}
        sx={{
          fontWeight: 600,
          ...(severity === "error" && {
            bgcolor: "error.dark",
            color: "white",
            "&:hover": {
              bgcolor: "error.main",
            },
          }),
        }}
      >
        {actionButton.text}
      </Button>
    );
  }

  return (
    <Alert
      severity={severity}
      onClose={dismissible ? onDismiss : undefined}
      action={alertAction}
      sx={{
        mb: marginBottom,
        ...(maxWidth && { maxWidth }),
        ...(centered && { mx: "auto" }),
      }}
    >
      {title && <AlertTitle>{title}</AlertTitle>}
      {renderMessage()}
    </Alert>
  );
};
