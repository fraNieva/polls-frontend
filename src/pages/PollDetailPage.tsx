import { useEffect, useState } from "react";
import {
  Container,
  Paper,
  Button,
  Alert,
  CircularProgress,
  Divider,
  Typography,
} from "@mui/material";
import { ArrowBack } from "@mui/icons-material";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../store";
import {
  fetchPollById,
  voteOnPoll,
  clearCurrentPoll,
  clearError,
} from "../store/slices/pollsSlice";
import {
  PollDetailHeader,
  PollMetadata,
  PollStatusChips,
  PollVotingForm,
  PollResultsDisplay,
  PollAuthPrompt,
} from "../components";

/**
 * Poll Detail Page
 * Displays full poll information with voting interface
 */
export const PollDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const {
    currentPoll: poll,
    isLoading,
    error,
  } = useAppSelector((state) => state.polls);
  const { isAuthenticated } = useAppSelector((state) => state.auth);

  const [selectedOptionId, setSelectedOptionId] = useState<number | null>(null);
  const [isVoting, setIsVoting] = useState(false);
  const [voteSuccess, setVoteSuccess] = useState(false);

  // Fetch poll on mount
  useEffect(() => {
    if (id) {
      dispatch(fetchPollById(Number(id)));
    }

    // Cleanup on unmount
    return () => {
      dispatch(clearCurrentPoll());
      dispatch(clearError());
    };
  }, [id, dispatch]);

  // Set selected option if user has already voted
  useEffect(() => {
    if (poll?.user_has_voted && poll.user_vote_option_id) {
      setSelectedOptionId(poll.user_vote_option_id);
    }
  }, [poll]);

  const handleVote = async (optionId: number) => {
    if (!poll) return;

    setIsVoting(true);
    setSelectedOptionId(optionId);

    try {
      await dispatch(voteOnPoll({ pollId: poll.id, optionId })).unwrap();
      setVoteSuccess(true);

      // Refetch poll data to get updated vote counts
      setTimeout(() => {
        dispatch(fetchPollById(poll.id));
        setVoteSuccess(false);
      }, 1500);
    } catch (error) {
      console.error("Vote failed:", error);
    } finally {
      setIsVoting(false);
    }
  };

  const handleClearError = () => {
    dispatch(clearError());
  };

  // Loading state
  if (isLoading && !poll) {
    return (
      <Container maxWidth="md" sx={{ py: 8 }}>
        <Paper
          sx={{
            p: 4,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 2,
          }}
        >
          <CircularProgress />
          <Typography color="text.secondary">Loading poll...</Typography>
        </Paper>
      </Container>
    );
  }

  // Error state
  if (error) {
    return (
      <Container maxWidth="md" sx={{ py: 8 }}>
        <Alert
          severity="error"
          onClose={handleClearError}
          action={
            <Button color="inherit" size="small" onClick={() => navigate(-1)}>
              Go Back
            </Button>
          }
        >
          {error}
        </Alert>
      </Container>
    );
  }

  // Poll not found
  if (!poll) {
    return (
      <Container maxWidth="md" sx={{ py: 8 }}>
        <Alert severity="warning">
          <Typography>Poll not found</Typography>
          <Button
            component={Link}
            to="/polls"
            variant="text"
            size="small"
            sx={{ mt: 1 }}
          >
            Back to Polls
          </Button>
        </Alert>
      </Container>
    );
  }

  const canVote = poll.is_active && !poll.user_has_voted && isAuthenticated;
  const hasVoted = poll.user_has_voted;

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      {/* Back Button */}
      <Button
        startIcon={<ArrowBack />}
        onClick={() => navigate(-1)}
        sx={{ mb: 3 }}
      >
        Back
      </Button>

      <Paper elevation={3} sx={{ p: 4 }}>
        {/* Poll Header */}
        <PollDetailHeader title={poll.title} description={poll.description} />

        {/* Poll Metadata */}
        <PollMetadata
          totalVotes={poll.total_votes}
          pubDate={poll.pub_date}
          pollId={poll.id}
        />

        {/* Status Chips */}
        <PollStatusChips
          hasVoted={hasVoted}
          isActive={poll.is_active}
          isPublic={poll.is_public}
          optionsCount={poll.options.length}
        />

        <Divider sx={{ my: 3 }} />

        {/* Success Message */}
        {voteSuccess && (
          <Alert severity="success" sx={{ mb: 3 }}>
            Your vote has been recorded successfully!
          </Alert>
        )}

        {/* Authentication Required Alert */}
        {!isAuthenticated && poll.is_active && <PollAuthPrompt />}

        {/* Voting Interface or Results */}
        {canVote ? (
          <PollVotingForm
            options={poll.options}
            onVote={handleVote}
            isVoting={isVoting}
            initialSelectedId={selectedOptionId}
          />
        ) : (
          <PollResultsDisplay
            options={poll.options}
            userVoteOptionId={poll.user_vote_option_id}
            showUserVote={hasVoted}
          />
        )}

        {/* Poll Closed Message */}
        {!poll.is_active && (
          <Alert severity="warning" sx={{ mt: 3 }}>
            This poll has been closed and is no longer accepting votes.
          </Alert>
        )}
      </Paper>
    </Container>
  );
};
