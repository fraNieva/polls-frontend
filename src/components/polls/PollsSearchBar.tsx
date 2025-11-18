import { TextField, InputAdornment } from "@mui/material";
import { Search as SearchIcon } from "@mui/icons-material";

interface PollsSearchBarProps {
  searchQuery: string;
  onSearchChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  maxWidth?: number;
}

/**
 * Search bar component for filtering polls
 * Includes search icon and responsive design
 */
export const PollsSearchBar = ({
  searchQuery,
  onSearchChange,
  placeholder = "Search polls...",
  maxWidth = 600,
}: PollsSearchBarProps) => {
  return (
    <TextField
      fullWidth
      variant="outlined"
      placeholder={placeholder}
      value={searchQuery}
      onChange={onSearchChange}
      slotProps={{
        input: {
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon color="action" />
            </InputAdornment>
          ),
        },
      }}
      sx={{
        maxWidth,
        "& .MuiOutlinedInput-root": {
          borderRadius: 3,
        },
      }}
    />
  );
};
