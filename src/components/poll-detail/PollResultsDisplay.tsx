import { Box, Stack, Typography, LinearProgress, Chip } from "@mui/material";
import { Check } from "@mui/icons-material";
import type { PollOption } from "../../types/poll";

/**
 * Props for PollResultsDisplay component
 */
export interface PollResultsDisplayProps {
  /** Array of poll options with vote counts */
  options: PollOption[];
  /** ID of the option the user voted for (if any) */
  userVoteOptionId?: number;
  /** Whether to show user's vote indicator */
  showUserVote?: boolean;
}

/**
 * Poll Results Display Component
 * Shows poll results with progress bars and percentages
 *
 * @example
 * ```tsx
 * <PollResultsDisplay
 *   options={pollOptions}
 *   userVoteOptionId={5}
 *   showUserVote={true}
 * />
 * ```
 */
export const PollResultsDisplay = ({
  options,
  userVoteOptionId,
  showUserVote = true,
}: PollResultsDisplayProps) => {
  // Sort options by vote count (highest first)
  const sortedOptions = [...options].sort(
    (a, b) => b.vote_count - a.vote_count
  );

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Poll Results
      </Typography>

      <Stack spacing={2} sx={{ mt: 2 }}>
        {sortedOptions.map((option: PollOption) => {
          const isUserVote = showUserVote && option.id === userVoteOptionId;

          return (
            <Box
              key={option.id}
              sx={{
                p: 2,
                border: "1px solid",
                borderColor: isUserVote ? "success.main" : "divider",
                borderRadius: 1,
                bgcolor: isUserVote ? "success.50" : "background.paper",
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  mb: 1,
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <Typography variant="body1">{option.text}</Typography>
                  {isUserVote && (
                    <Chip
                      label="Your vote"
                      size="small"
                      color="success"
                      icon={<Check />}
                    />
                  )}
                </Box>
                <Typography variant="body1" fontWeight="bold">
                  {option.percentage.toFixed(1)}%
                </Typography>
              </Box>
              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                <LinearProgress
                  variant="determinate"
                  value={option.percentage}
                  sx={{
                    flexGrow: 1,
                    height: 8,
                    borderRadius: 4,
                    bgcolor: "action.hover",
                    "& .MuiLinearProgress-bar": {
                      bgcolor: isUserVote ? "success.main" : "primary.main",
                    },
                  }}
                />
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ minWidth: 70, textAlign: "right" }}
                >
                  {option.vote_count} vote{option.vote_count === 1 ? "" : "s"}
                </Typography>
              </Box>
            </Box>
          );
        })}
      </Stack>
    </Box>
  );
};
