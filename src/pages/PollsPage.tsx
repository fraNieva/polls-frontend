import {
  useEffect,
  useMemo,
  useCallback,
  useState,
  Suspense,
  use,
} from "react";
import { useAppDispatch, useAppSelector } from "../store";
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
import {
  // Backward compatibility imports for now
  clearPublicError,
  setPublicSearchQuery,
  setPublicCurrentPage,
} from "../store/slices/pollsSlice";
import { pollsAPI } from "../services/api";
import type { Poll, PaginationMeta } from "../types/poll";

// Create a promise for polling data that will be consumed by use()
const createPollsPromise = (page: number, search: string) => {
  return pollsAPI.getPublicPolls(page, 10, search || undefined);
};

// Component that uses the use() hook to fetch data with Redux integration
const PollsList = ({
  pollsPromise,
  onPageChange,
  onDataLoaded,
}: {
  pollsPromise: Promise<{ polls: Poll[]; pagination: PaginationMeta }>;
  onPageChange: (page: number) => void;
  onDataLoaded: () => void;
}) => {
  const data = use(pollsPromise);

  // Update Redux store when data is loaded
  useEffect(() => {
    onDataLoaded();
  }, [onDataLoaded]);

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
        {data.polls.map((poll) => (
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

// Enhanced loading skeleton component
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
      <Paper
        sx={{
          p: 3,
          height: 300,
          backgroundColor: "grey.50",
          animation: "pulse 1.5s ease-in-out infinite",
          "@keyframes pulse": {
            "0%": {
              backgroundColor: "grey.50",
            },
            "50%": {
              backgroundColor: "grey.100",
            },
            "100%": {
              backgroundColor: "grey.50",
            },
          },
        }}
        key={`skeleton-poll-${index}`}
      >
        <Skeleton variant="circular" width={40} height={40} sx={{ mb: 2 }} />
        <Skeleton variant="text" height={32} sx={{ mb: 1 }} />
        <Skeleton variant="text" height={24} sx={{ mb: 2 }} />
        <Skeleton variant="rectangular" height={60} sx={{ mb: 2 }} />
        <Box display="flex" gap={1} mt={2}>
          <Skeleton variant="rounded" width={60} height={24} />
          <Skeleton variant="rounded" width={80} height={24} />
        </Box>
        <Box display="flex" justifyContent="space-between" mt={2}>
          <Skeleton variant="rounded" width={100} height={32} />
          <Skeleton variant="rounded" width={80} height={32} />
        </Box>
      </Paper>
    ))}
  </Box>
);

// Custom hook for debounced search
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

export const PollsPage = () => {
  const dispatch = useAppDispatch();

  // Redux state for search and pagination management (unified approach)
  const { polls, pagination, error, searchQuery, currentPage } = useAppSelector(
    (state) => state.polls
  );

  // Debounce search query
  const debouncedSearchQuery = useDebounce(searchQuery, 300);

  // Create promise for use() hook - regenerate when search/page changes
  const [pollsPromise, setPollsPromise] = useState(() =>
    createPollsPromise(currentPage, debouncedSearchQuery)
  );

  // Update promise when search or page changes
  useEffect(() => {
    const newPromise = createPollsPromise(currentPage, debouncedSearchQuery);
    setPollsPromise(newPromise);
  }, [currentPage, debouncedSearchQuery]);

  // Handlers - use unified actions
  const handlePageChange = useCallback(
    (newPage: number) => {
      dispatch(setPublicCurrentPage(newPage)); // Use backward compatibility action for now
    },
    [dispatch]
  );

  const handleSearchChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      dispatch(setPublicSearchQuery(event.target.value)); // Use backward compatibility action for now
    },
    [dispatch]
  );

  const handleClearError = useCallback(() => {
    dispatch(clearPublicError()); // Use backward compatibility action for now
  }, [dispatch]);

  // Sync data from use() hook to Redux store
  const handleDataLoaded = useCallback(() => {
    // This could trigger a Redux action to cache the data
    // For now, we rely on the component state from use() hook
  }, []);

  // Show cached data if available while loading new data
  const showCachedData = useMemo(() => {
    return polls.length > 0 && !error;
  }, [polls.length, error]);

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
          value={searchQuery}
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
        <Alert severity="error" sx={{ mb: 3 }} onClose={handleClearError}>
          {error}
        </Alert>
      )}

      {/* Stats */}
      {pagination && (
        <Box mb={3}>
          <Typography variant="body2" color="text.secondary">
            {debouncedSearchQuery
              ? `Found ${pagination.total} polls matching "${debouncedSearchQuery}"`
              : `Showing ${pagination.total} public polls`}
          </Typography>
        </Box>
      )}

      {/* Polls Content with Suspense and use() hook */}
      <Suspense
        fallback={
          showCachedData ? (
            // Show cached data with loading indicator
            <Box>
              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: {
                    xs: "1fr",
                    sm: "repeat(2, 1fr)",
                    lg: "repeat(3, 1fr)",
                  },
                  gap: 3,
                  opacity: 0.7,
                }}
              >
                {polls.map((poll) => (
                  <PollCard poll={poll} key={poll.id} />
                ))}
              </Box>
            </Box>
          ) : (
            // Show skeleton for fresh loads
            <PollsLoadingSkeleton />
          )
        }
      >
        <PollsList
          pollsPromise={pollsPromise}
          onPageChange={handlePageChange}
          onDataLoaded={handleDataLoaded}
          key={`${currentPage}-${debouncedSearchQuery}`}
        />
      </Suspense>
    </Container>
  );
};
