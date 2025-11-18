import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { pollsAPI } from "../../services/api";
import type { Poll, PaginationMeta } from "../../types/poll";

interface PollsState {
  polls: Poll[];
  currentPoll: Poll | null;
  pagination: PaginationMeta | null;
  isLoading: boolean;
  error: string | null;
  searchQuery: string;
  currentPage: number;
  filters: {
    is_public?: boolean;
    is_active?: boolean;
    owner_id?: number;
  };
}

const initialState: PollsState = {
  polls: [],
  currentPoll: null,
  pagination: null,
  isLoading: false,
  error: null,
  searchQuery: "",
  currentPage: 1,
  filters: {
    is_public: true, // Default to public polls for unauthenticated users
    is_active: true,
  },
};

export const fetchPolls = createAsyncThunk(
  "polls/fetchPolls",
  async (params: {
    page?: number;
    size?: number;
    search?: string;
    is_public?: boolean;
    is_active?: boolean;
    owner_id?: number;
  }) => {
    const { page, size, search, ...filters } = params;
    const response = await pollsAPI.getPolls(page, size, {
      ...(search && { search }),
      ...filters,
    });
    return response;
  },
  {
    condition: (_, { getState }) => {
      const state = getState() as { polls: PollsState };
      // Only fetch if not already loading to prevent duplicate requests
      return !state.polls.isLoading;
    },
  }
);

// Keep for backward compatibility but deprecate
export const fetchPublicPolls = createAsyncThunk(
  "polls/fetchPublicPolls",
  async (params: { page?: number; size?: number; search?: string } = {}) => {
    const response = await pollsAPI.getPolls(params.page, params.size, {
      ...(params.search && { search: params.search }),
      is_public: true,
      is_active: true,
    });
    return response;
  }
);

export const fetchPollById = createAsyncThunk(
  "polls/fetchPollById",
  async (pollId: number) => {
    const response = await pollsAPI.getPollDetails(pollId);
    return response;
  }
);

export const voteOnPoll = createAsyncThunk(
  "polls/voteOnPoll",
  async ({ pollId, optionId }: { pollId: number; optionId: number }) => {
    const response = await pollsAPI.voteOnPoll(pollId, optionId);
    return { pollId, optionId, response };
  }
);

export const createPoll = createAsyncThunk(
  "polls/createPoll",
  async (pollData: {
    title: string;
    description?: string;
    is_active?: boolean;
    is_public?: boolean;
    options?: string[];
  }) => {
    const response = await pollsAPI.createPoll(pollData);
    return response;
  }
);

const pollsSlice = createSlice({
  name: "polls",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearCurrentPoll: (state) => {
      state.currentPoll = null;
    },
    setSearchQuery: (state, action) => {
      state.searchQuery = action.payload;
      state.currentPage = 1;
    },
    setCurrentPage: (state, action) => {
      state.currentPage = action.payload;
    },
    // Backward compatibility actions - proxy to unified state
    clearPublicError: (state) => {
      state.error = null;
    },
    setPublicSearchQuery: (state, action) => {
      state.searchQuery = action.payload;
      state.currentPage = 1; // Reset to first page when searching
    },
    setPublicCurrentPage: (state, action) => {
      state.currentPage = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch polls (unified)
      .addCase(fetchPolls.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchPolls.fulfilled, (state, action) => {
        state.isLoading = false;
        state.polls = action.payload.polls;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchPolls.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || "Failed to fetch polls";
      })
      // Fetch public polls (backward compatibility - proxy to unified)
      .addCase(fetchPublicPolls.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchPublicPolls.fulfilled, (state, action) => {
        state.isLoading = false;
        state.polls = action.payload.polls;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchPublicPolls.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || "Failed to fetch public polls";
      })
      // Fetch poll by ID
      .addCase(fetchPollById.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchPollById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentPoll = action.payload;
      })
      .addCase(fetchPollById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || "Failed to fetch poll";
      })
      // Vote on poll
      .addCase(voteOnPoll.fulfilled, (state, action) => {
        // Update current poll if it matches
        if (
          state.currentPoll &&
          state.currentPoll.id === action.payload.pollId
        ) {
          // Refresh poll data after voting - in real app, you'd update optimistically
          // or refetch the poll data
        }
        // Update in unified polls state (no separate public polls)
        const pollIndex = state.polls.findIndex(
          (poll) => poll.id === action.payload.pollId
        );
        if (pollIndex !== -1) {
          // Mark as voted optimistically
          state.polls[pollIndex].user_has_voted = true;
          state.polls[pollIndex].user_vote_option_id = action.payload.optionId;
        }
      })
      // Create poll
      .addCase(createPoll.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createPoll.fulfilled, (state, action) => {
        state.isLoading = false;
        // Add new poll to the beginning of the list
        state.polls.unshift(action.payload);
        state.currentPoll = action.payload;
      })
      .addCase(createPoll.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || "Failed to create poll";
      });
  },
});

export const {
  clearError,
  clearCurrentPoll,
  setSearchQuery,
  setCurrentPage,
  // Backward compatibility exports
  clearPublicError,
  setPublicSearchQuery,
  setPublicCurrentPage,
} = pollsSlice.actions;

export default pollsSlice.reducer;
