import { useState, useEffect, Suspense, use } from "react";
import {
  Typography,
  Box,
  Alert,
  TextField,
  InputAdornment,
  Container,
  Paper,
  Pagination,
  Skeleton,
} from "@mui/material";
import { Search as SearchIcon } from "@mui/icons-material";
import { PollCard } from "../components/PollCard";
import { pollsAPI } from "../services/api";
import type { Poll, PaginationMeta } from "../types/poll";

// Create a promise for polling data that will be consumed by use()
const createPollsPromise = (page: number, search: string) => {
  return pollsAPI.getPublicPolls(page, 10, search || undefined);
};

// Component that uses the use() hook to fetch data
const PollsList = ({
  pollsPromise,
  onPageChange,
}: {
  pollsPromise: Promise<{ polls: Poll[]; pagination: PaginationMeta }>;
  onPageChange: (page: number) => void;
}) => {
  const data = use(pollsPromise);

  if (!data.polls.length) {
    return (
      <Box textAlign="center" py={8}>
        <Typography variant="h6" color="text.secondary">
          No public polls found
        </Typography>
        <Typography variant="body2" color="text.secondary" mt={1}>
          Be the first to create a public poll!
        </Typography>
      </Box>
    );
  }

  return (
    <>
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            sm: "repeat(2, 1fr)",
            lg: "repeat(3, 1fr)",
          },
          gap: 3,
        }}
      >
        {data.polls.map((poll: Poll) => (
          <PollCard poll={poll} key={poll.id} />
        ))}
      </Box>

      {data.pagination.pages > 1 && (
        <Box display="flex" justifyContent="center" mt={4}>
          <Paper sx={{ p: 2 }}>
            <Pagination
              count={data.pagination.pages}
              page={data.pagination.page}
              color="primary"
              size="large"
              showFirstButton
              showLastButton
              onChange={(_, newPage) => onPageChange(newPage)}
            />
          </Paper>
        </Box>
      )}
    </>
  );
};

// Loading skeleton component
const PollsLoadingSkeleton = () => (
  <Box
    sx={{
      display: "grid",
      gridTemplateColumns: {
        xs: "1fr",
        sm: "repeat(2, 1fr)",
        lg: "repeat(3, 1fr)",
      },
      gap: 3,
    }}
  >
    {Array.from({ length: 6 }, (_, index) => (
      <Paper sx={{ p: 3, height: 300 }} key={`skeleton-poll-${index}`}>
        <Skeleton variant="circular" width={40} height={40} sx={{ mb: 2 }} />
        <Skeleton variant="text" height={32} sx={{ mb: 1 }} />
        <Skeleton variant="text" height={24} sx={{ mb: 2 }} />
        <Skeleton variant="rectangular" height={60} sx={{ mb: 2 }} />
        <Box display="flex" gap={1}>
          <Skeleton variant="rounded" width={60} height={24} />
          <Skeleton variant="rounded" width={80} height={24} />
        </Box>
      </Paper>
    ))}
  </Box>
);

export const PollsPage = () => {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [pollsPromise, setPollsPromise] = useState(() =>
    createPollsPromise(page, debouncedSearch)
  );
  const [error, setError] = useState<string | null>(null);

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 300);

    return () => clearTimeout(timer);
  }, [search]);

  // Update polls promise when page or search changes
  useEffect(() => {
    setError(null);
    const newPromise = createPollsPromise(page, debouncedSearch);

    // Handle promise rejection to show errors
    newPromise.catch((err) => {
      setError(err.response?.data?.detail || "Failed to load polls");
    });

    setPollsPromise(newPromise);
  }, [page, debouncedSearch]);

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(event.target.value);
    setPage(1); // Reset to first page when searching
  };

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Header */}
      <Box mb={4}>
        <Typography variant="h3" component="h1" gutterBottom>
          Public Polls
        </Typography>
        <Typography variant="h6" color="text.secondary" mb={3}>
          Discover and participate in polls from the community
        </Typography>

        {/* Search */}
        <TextField
          fullWidth
          placeholder="Search polls..."
          value={search}
          onChange={handleSearchChange}
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            },
          }}
          sx={{ maxWidth: 500 }}
        />
      </Box>

      {/* Error State */}
      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {/* Polls List with Suspense */}
      <Suspense fallback={<PollsLoadingSkeleton />}>
        <PollsList
          pollsPromise={pollsPromise}
          onPageChange={handlePageChange}
          key={`${page}-${debouncedSearch}`}
        />
      </Suspense>
    </Container>
  );
};
