import { Box, Stack, Typography } from "@mui/material";
import { HowToVote, AccessTime, Person } from "@mui/icons-material";
import { formatDistanceToNow } from "date-fns";

/**
 * Props for PollMetadata component
 */
export interface PollMetadataProps {
  /** Total number of votes */
  totalVotes: number;
  /** Poll publication/creation date */
  pubDate: string;
  /** Poll ID (optional for compact variant) */
  pollId?: number;
  /** Display variant - compact for cards, default for detail pages */
  variant?: "default" | "compact";
  /** Custom margin bottom */
  marginBottom?: number;
  /** Custom spacing between items */
  spacing?: number;
}

/**
 * Poll Metadata Component
 * Displays vote count, creation date, and poll ID
 *
 * @example
 * ```tsx
 * <PollMetadata
 *   totalVotes={150}
 *   pubDate="2025-11-10T10:00:00Z"
 *   pollId={42}
 * />
 * ```
 */
export const PollMetadata = ({
  totalVotes,
  pubDate,
  pollId,
  variant = "default",
  marginBottom,
  spacing,
}: PollMetadataProps) => {
  const formattedDate = formatDistanceToNow(new Date(pubDate), {
    addSuffix: true,
  });

  // Determine spacing and layout based on variant
  const isCompact = variant === "compact";
  const defaultSpacing = isCompact ? 2 : 2;
  const defaultMarginBottom = isCompact ? 2 : 3;
  const iconGap = isCompact ? 0.5 : 1;

  return (
    <Stack
      direction={{ xs: "column", sm: "row" }}
      spacing={spacing ?? defaultSpacing}
      sx={{ mb: marginBottom ?? defaultMarginBottom }}
    >
      <Box sx={{ display: "flex", alignItems: "center", gap: iconGap }}>
        <HowToVote fontSize="small" color="action" />
        <Typography variant="body2" color="text.secondary">
          {totalVotes} vote{totalVotes === 1 ? "" : "s"}
        </Typography>
      </Box>
      <Box sx={{ display: "flex", alignItems: "center", gap: iconGap }}>
        <AccessTime fontSize="small" color="action" />
        <Typography variant="body2" color="text.secondary">
          {isCompact ? formattedDate : `Created ${formattedDate}`}
        </Typography>
      </Box>
      {pollId !== undefined && !isCompact && (
        <Box sx={{ display: "flex", alignItems: "center", gap: iconGap }}>
          <Person fontSize="small" color="action" />
          <Typography variant="body2" color="text.secondary">
            Poll #{pollId}
          </Typography>
        </Box>
      )}
    </Stack>
  );
};
