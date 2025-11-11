import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { pollsAPI } from "../../services/api";

interface PollOption {
  id: number;
  text: string;
  vote_count: number;
  percentage: number;
  poll_id: number;
}

interface Poll {
  id: number;
  title: string;
  description: string | null;
  is_active: boolean;
  is_public: boolean;
  owner_id: number;
  pub_date: string;
  options: PollOption[];
  total_votes: number;
  user_has_voted: boolean;
  user_vote_option_id: number | null;
}

interface PaginationMeta {
  total: number;
  page: number;
  size: number;
  pages: number;
  has_next: boolean;
  has_prev: boolean;
}

interface PollsState {
  polls: Poll[];
  currentPoll: Poll | null;
  pagination: PaginationMeta | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: PollsState = {
  polls: [],
  currentPoll: null,
  pagination: null,
  isLoading: false,
  error: null,
};

export const fetchPolls = createAsyncThunk(
  "polls/fetchPolls",
  async (params: { page?: number; size?: number; search?: string } = {}) => {
    const response = await pollsAPI.getPolls(params.page, params.size, {
      ...(params.search && { search: params.search }),
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
  },
  extraReducers: (builder) => {
    builder
      // Fetch polls
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
      });
  },
});

export const { clearError, clearCurrentPoll } = pollsSlice.actions;
export default pollsSlice.reducer;
