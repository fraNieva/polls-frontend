import { Box, Paper, Skeleton } from "@mui/material";

/**
 * Individual skeleton card for loading state
 */
export const PollSkeletonCard = () => (
  <Paper
    elevation={1}
    sx={{
      p: 3,
      height: "280px",
      borderRadius: 2,
    }}
  >
    <Skeleton variant="text" sx={{ fontSize: "1.5rem", mb: 2 }} />
    <Skeleton variant="text" sx={{ mb: 3 }} />
    <Skeleton variant="text" sx={{ mb: 2 }} />
    <Skeleton variant="rectangular" height={30} sx={{ mb: 2 }} />
    <Skeleton variant="rectangular" height={30} sx={{ mb: 2 }} />
  </Paper>
);

/**
 * Grid of skeleton cards for polls loading state
 */
export const PollsLoadingSkeleton = () => {
  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: {
          xs: "1fr",
          sm: "repeat(auto-fill, minmax(300px, 1fr))",
          md: "repeat(auto-fill, minmax(350px, 1fr))",
        },
        gap: 3,
      }}
    >
      {Array.from({ length: 6 }, (_, index) => (
        <PollSkeletonCard key={`skeleton-${index}`} />
      ))}
    </Box>
  );
};
