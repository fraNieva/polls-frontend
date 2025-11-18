import { Box, Typography } from "@mui/material";
import { PollsSearchBar } from "./PollsSearchBar";

interface PollsPageHeaderProps {
  searchQuery: string;
  onSearchChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  title?: string;
  subtitle?: string;
}

/**
 * Header component for the polls page
 * Includes title, subtitle, and search functionality
 */
export const PollsPageHeader = ({
  searchQuery,
  onSearchChange,
  title = "Public Polls",
  subtitle = "Explore and participate in public polls from our community",
}: PollsPageHeaderProps) => {
  return (
    <Box sx={{ mb: 4 }}>
      <Typography
        variant="h2"
        component="h1"
        gutterBottom
        sx={{
          fontWeight: "bold",
          background: "linear-gradient(45deg, #1976d2 30%, #42a5f5 90%)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          backgroundClip: "text",
        }}
      >
        {title}
      </Typography>
      <Typography variant="subtitle1" color="text.secondary" sx={{ mb: 3 }}>
        {subtitle}
      </Typography>

      <PollsSearchBar
        searchQuery={searchQuery}
        onSearchChange={onSearchChange}
      />
    </Box>
  );
};
