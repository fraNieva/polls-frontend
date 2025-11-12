import { useEffect, useCallback, useState } from "react";
import { useAppDispatch, useAppSelector } from "../store";
import { Container } from "@mui/material";
import {
  fetchPolls,
  clearError,
  setSearchQuery,
  setCurrentPage,
} from "../store/slices/pollsSlice";
import { useDebounce } from "../hooks/useDebounce";
import { PollsPageHeader } from "../components/PollsPageHeader";
import { PollsErrorDisplay } from "../components/PollsErrorDisplay";
import { PollsLoadingSkeleton } from "../components/PollsLoadingSkeleton";
import { PollsEmptyState } from "../components/PollsEmptyState";
import { PollsGrid } from "../components/PollsGrid";
import { PollsPagination } from "../components/PollsPagination";

/**
 * Main PollsPage component
 * Displays public polls with search, pagination, and voting functionality
 */
export const PollsPage = () => {
  const dispatch = useAppDispatch();
  const { polls, isLoading, error, searchQuery, currentPage, pagination } =
    useAppSelector((state) => state.polls);

  // Local state for search input (before debounce)
  const [localSearchQuery, setLocalSearchQuery] = useState(searchQuery || "");

  // Debounce search query to avoid too many API calls
  const debouncedSearchQuery = useDebounce(localSearchQuery, 300);

  // Only update Redux search query when debounced value actually changes
  useEffect(() => {
    if (debouncedSearchQuery !== searchQuery) {
      dispatch(setSearchQuery(debouncedSearchQuery));
    }
  }, [debouncedSearchQuery, searchQuery, dispatch]);

  // Fetch polls when component mounts or when search/page changes
  useEffect(() => {
    // AbortController for request cancellation
    const abortController = new AbortController();

    dispatch(
      fetchPolls({
        page: currentPage,
        search: debouncedSearchQuery || undefined,
        is_public: true, // Only fetch public polls
        is_active: true,
      })
    );

    // Cleanup function to abort request if component unmounts or effect re-runs
    return () => {
      abortController.abort();
    };
  }, [dispatch, currentPage, debouncedSearchQuery]);

  // Handle page changes
  const handlePageChange = useCallback(
    (_: React.ChangeEvent<unknown>, newPage: number) => {
      dispatch(setCurrentPage(newPage));
      window.scrollTo({ top: 0, behavior: "smooth" });
    },
    [dispatch]
  );

  // Handle search changes
  const handleSearchChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const value = event.target.value;
      setLocalSearchQuery(value);
      // Only reset to page 1 if we're not already there
      if (currentPage !== 1) {
        dispatch(setCurrentPage(1));
      }
    },
    [dispatch, currentPage]
  );

  // Clear error handler
  const handleClearError = useCallback(() => {
    dispatch(clearError());
  }, [dispatch]);

  // Handle retry
  const handleRetry = useCallback(() => {
    handleClearError();
    dispatch(
      fetchPolls({
        page: currentPage,
        search: debouncedSearchQuery || undefined,
        is_public: true,
        is_active: true,
      })
    );
  }, [dispatch, currentPage, debouncedSearchQuery, handleClearError]);

  // Handle vote action (to be implemented)
  const handleVote = useCallback((pollId: number, optionId: number) => {
    // Future enhancement: Implement voting logic with API call
    console.log("Vote action:", { pollId, optionId });
  }, []);

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Header with search */}
      <PollsPageHeader
        searchQuery={localSearchQuery}
        onSearchChange={handleSearchChange}
      />

      {/* Error Display */}
      {error && <PollsErrorDisplay error={error} onRetry={handleRetry} />}

      {/* Content */}
      {isLoading && <PollsLoadingSkeleton />}

      {!isLoading && polls.length === 0 && (
        <PollsEmptyState
          hasSearchQuery={!!debouncedSearchQuery}
          searchQuery={debouncedSearchQuery}
        />
      )}

      {!isLoading && polls.length > 0 && (
        <>
          <PollsGrid polls={polls} onVote={handleVote} />
          <PollsPagination
            pagination={pagination}
            onPageChange={handlePageChange}
          />
        </>
      )}
    </Container>
  );
};
