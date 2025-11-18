import { Box, Chip } from "@mui/material";
import { Check } from "@mui/icons-material";

/**
 * Props for PollStatusChips component
 */
export interface PollStatusChipsProps {
  /** Whether the current user has voted */
  hasVoted: boolean;
  /** Whether the poll is active/open */
  isActive: boolean;
  /** Whether the poll is public or private */
  isPublic: boolean;
  /** Number of options in the poll */
  optionsCount: number;
}

/**
 * Poll Status Chips Component
 * Displays status indicators for the poll
 *
 * @example
 * ```tsx
 * <PollStatusChips
 *   hasVoted={true}
 *   isActive={true}
 *   isPublic={true}
 *   optionsCount={4}
 * />
 * ```
 */
export const PollStatusChips = ({
  hasVoted,
  isActive,
  isPublic,
  optionsCount,
}: PollStatusChipsProps) => {
  return (
    <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap", mb: 3 }}>
      {hasVoted && (
        <Chip label="You voted" size="small" color="success" icon={<Check />} />
      )}
      {!isActive && <Chip label="Poll Closed" size="small" color="error" />}
      {isPublic ? (
        <Chip label="Public" size="small" variant="outlined" />
      ) : (
        <Chip label="Private" size="small" variant="outlined" />
      )}
      <Chip
        label={`${optionsCount} option${optionsCount === 1 ? "" : "s"}`}
        size="small"
        variant="outlined"
      />
    </Box>
  );
};
