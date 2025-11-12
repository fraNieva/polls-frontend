import { Box, Alert, Typography } from "@mui/material";

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
    <Box sx={{ mb: 3 }}>
      <Alert
        severity="error"
        action={
          <Box>
            <button
              onClick={onRetry}
              style={{
                marginLeft: "8px",
                padding: "4px 8px",
                background: "#d32f2f",
                color: "white",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
              }}
            >
              Try Again
            </button>
          </Box>
        }
        sx={{ maxWidth, mx: "auto" }}
      >
        <Typography variant="h6" gutterBottom>
          Failed to load polls
        </Typography>
        <Typography variant="body2">
          {error || "Something went wrong. Please try again."}
        </Typography>
      </Alert>
    </Box>
  );
};
