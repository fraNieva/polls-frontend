import { FormControlLabel, Switch, Box, Typography } from "@mui/material";
import { Public as PublicIcon, Lock as LockIcon } from "@mui/icons-material";

interface PollVisibilityToggleProps {
  isPublic: boolean;
  onChange: (isPublic: boolean) => void;
  disabled?: boolean;
}

/**
 * Toggle for poll visibility (public vs private)
 *
 * Features:
 * - Visual toggle between public and private
 * - Icons for better UX
 * - Helper text explaining visibility
 *
 * @example
 * ```tsx
 * <PollVisibilityToggle
 *   isPublic={formData.isPublic}
 *   onChange={handleVisibilityChange}
 * />
 * ```
 */
export const PollVisibilityToggle = ({
  isPublic,
  onChange,
  disabled = false,
}: PollVisibilityToggleProps) => {
  return (
    <Box>
      <FormControlLabel
        control={
          <Switch
            checked={isPublic}
            onChange={(e) => onChange(e.target.checked)}
            disabled={disabled}
          />
        }
        label={
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            {isPublic ? (
              <>
                <PublicIcon fontSize="small" color="primary" />
                <Typography variant="body2">Public Poll</Typography>
              </>
            ) : (
              <>
                <LockIcon fontSize="small" color="action" />
                <Typography variant="body2">Private Poll</Typography>
              </>
            )}
          </Box>
        }
      />
      <Typography
        variant="caption"
        color="text.secondary"
        sx={{ display: "block", ml: 4 }}
      >
        {isPublic
          ? "Everyone can see and vote on this poll"
          : "Only you can access this poll"}
      </Typography>
    </Box>
  );
};
