import { Box, Typography } from "@mui/material";

interface PollsEmptyStateProps {
  hasSearchQuery: boolean;
  searchQuery?: string;
}

/**
 * Empty state component for when no polls are found
 * Shows different messages for search vs general empty state
 */
export const PollsEmptyState = ({
  hasSearchQuery,
  searchQuery,
}: PollsEmptyStateProps) => {
  return (
    <Box
      sx={{
        textAlign: "center",
        py: 4,
      }}
    >
      <Typography variant="h6" color="text.secondary">
        {hasSearchQuery
          ? `No polls found for "${searchQuery}"`
          : "No polls found"}
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
        {hasSearchQuery
          ? "Try adjusting your search terms"
          : "Be the first to create a poll!"}
      </Typography>
    </Box>
  );
};
