import { Button, CircularProgress } from "@mui/material";
import { Send as SendIcon } from "@mui/icons-material";

interface PollSubmitButtonProps {
  isLoading: boolean;
  disabled?: boolean;
  loadingText?: string;
  children: React.ReactNode;
}

/**
 * Submit button for poll creation
 *
 * Features:
 * - Loading state with spinner
 * - Customizable text
 * - Icon support
 * - Full width on mobile
 *
 * @example
 * ```tsx
 * <PollSubmitButton isLoading={isLoading} disabled={!isFormValid}>
 *   Create Poll
 * </PollSubmitButton>
 * ```
 */
export const PollSubmitButton = ({
  isLoading,
  disabled = false,
  loadingText = "Creating...",
  children,
}: PollSubmitButtonProps) => {
  return (
    <Button
      type="submit"
      variant="contained"
      size="large"
      fullWidth
      disabled={isLoading || disabled}
      startIcon={
        isLoading ? (
          <CircularProgress size={20} color="inherit" />
        ) : (
          <SendIcon />
        )
      }
    >
      {isLoading ? loadingText : children}
    </Button>
  );
};
