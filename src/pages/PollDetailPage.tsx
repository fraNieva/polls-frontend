import { useEffect, useState } from "react";
import {
  Container,
  Paper,
  Typography,
  Box,
  Button,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  LinearProgress,
  Chip,
  Alert,
  CircularProgress,
  Divider,
  Avatar,
  Stack,
} from "@mui/material";
import {
  HowToVote,
  AccessTime,
  Person,
  Check,
  ArrowBack,
} from "@mui/icons-material";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../store";
import {
  fetchPollById,
  voteOnPoll,
  clearCurrentPoll,
  clearError,
} from "../store/slices/pollsSlice";
import { formatDistanceToNow } from "date-fns";
import type { PollOption } from "../types/poll";

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

  const handleVote = async () => {
    if (!selectedOptionId || !poll) return;

    setIsVoting(true);
    try {
      await dispatch(
        voteOnPoll({ pollId: poll.id, optionId: selectedOptionId })
      ).unwrap();
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

  const formattedDate = formatDistanceToNow(new Date(poll.pub_date), {
    addSuffix: true,
  });

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
        <Box sx={{ display: "flex", alignItems: "flex-start", gap: 2, mb: 3 }}>
          <Avatar sx={{ bgcolor: "primary.main", width: 56, height: 56 }}>
            <HowToVote />
          </Avatar>
          <Box sx={{ flexGrow: 1 }}>
            <Typography variant="h4" component="h1" gutterBottom>
              {poll.title}
            </Typography>
            {poll.description && (
              <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
                {poll.description}
              </Typography>
            )}
          </Box>
        </Box>

        {/* Poll Metadata */}
        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={2}
          sx={{ mb: 3 }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <HowToVote fontSize="small" color="action" />
            <Typography variant="body2" color="text.secondary">
              {poll.total_votes} vote{poll.total_votes === 1 ? "" : "s"}
            </Typography>
          </Box>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <AccessTime fontSize="small" color="action" />
            <Typography variant="body2" color="text.secondary">
              Created {formattedDate}
            </Typography>
          </Box>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Person fontSize="small" color="action" />
            <Typography variant="body2" color="text.secondary">
              Poll #{poll.id}
            </Typography>
          </Box>
        </Stack>

        {/* Status Chips */}
        <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap", mb: 3 }}>
          {hasVoted && (
            <Chip
              label="You voted"
              size="small"
              color="success"
              icon={<Check />}
            />
          )}
          {!poll.is_active && (
            <Chip label="Poll Closed" size="small" color="error" />
          )}
          {poll.is_public ? (
            <Chip label="Public" size="small" variant="outlined" />
          ) : (
            <Chip label="Private" size="small" variant="outlined" />
          )}
        </Box>

        <Divider sx={{ my: 3 }} />

        {/* Success Message */}
        {voteSuccess && (
          <Alert severity="success" sx={{ mb: 3 }}>
            Your vote has been recorded successfully!
          </Alert>
        )}

        {/* Authentication Required Alert */}
        {!isAuthenticated && poll.is_active && (
          <Alert severity="info" sx={{ mb: 3 }}>
            <Typography variant="body2">
              Please{" "}
              <Link
                to="/login"
                style={{ color: "inherit", fontWeight: "bold" }}
              >
                sign in
              </Link>{" "}
              to vote on this poll
            </Typography>
          </Alert>
        )}

        {/* Voting Interface or Results */}
        <Box>
          <Typography variant="h6" gutterBottom>
            {canVote ? "Cast Your Vote" : "Poll Results"}
          </Typography>

          {canVote ? (
            // Voting Form
            <FormControl component="fieldset" fullWidth sx={{ mt: 2 }}>
              <RadioGroup
                value={selectedOptionId}
                onChange={(e) => setSelectedOptionId(Number(e.target.value))}
              >
                {poll.options.map((option: PollOption) => (
                  <Box key={option.id} sx={{ mb: 2 }}>
                    <FormControlLabel
                      value={option.id}
                      control={<Radio />}
                      label={
                        <Typography variant="body1">{option.text}</Typography>
                      }
                      sx={{
                        border: "1px solid",
                        borderColor:
                          selectedOptionId === option.id
                            ? "primary.main"
                            : "divider",
                        borderRadius: 1,
                        p: 2,
                        m: 0,
                        width: "100%",
                        transition: "all 0.2s",
                        "&:hover": {
                          bgcolor: "action.hover",
                        },
                      }}
                    />
                  </Box>
                ))}
              </RadioGroup>

              <Button
                variant="contained"
                size="large"
                fullWidth
                onClick={handleVote}
                disabled={!selectedOptionId || isVoting}
                startIcon={
                  isVoting ? <CircularProgress size={20} /> : <Check />
                }
                sx={{ mt: 2 }}
              >
                {isVoting ? "Submitting..." : "Submit Vote"}
              </Button>
            </FormControl>
          ) : (
            // Results Display
            <Stack spacing={2} sx={{ mt: 2 }}>
              {[...poll.options]
                .sort((a, b) => b.vote_count - a.vote_count)
                .map((option: PollOption) => {
                  const isUserVote =
                    hasVoted && option.id === poll.user_vote_option_id;
                  return (
                    <Box
                      key={option.id}
                      sx={{
                        p: 2,
                        border: "1px solid",
                        borderColor: isUserVote ? "success.main" : "divider",
                        borderRadius: 1,
                        bgcolor: isUserVote ? "success.50" : "background.paper",
                      }}
                    >
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          mb: 1,
                        }}
                      >
                        <Box
                          sx={{ display: "flex", alignItems: "center", gap: 1 }}
                        >
                          <Typography variant="body1">{option.text}</Typography>
                          {isUserVote && (
                            <Chip
                              label="Your vote"
                              size="small"
                              color="success"
                              icon={<Check />}
                            />
                          )}
                        </Box>
                        <Typography variant="body1" fontWeight="bold">
                          {option.percentage.toFixed(1)}%
                        </Typography>
                      </Box>
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 2 }}
                      >
                        <LinearProgress
                          variant="determinate"
                          value={option.percentage}
                          sx={{
                            flexGrow: 1,
                            height: 8,
                            borderRadius: 4,
                            bgcolor: "action.hover",
                            "& .MuiLinearProgress-bar": {
                              bgcolor: isUserVote
                                ? "success.main"
                                : "primary.main",
                            },
                          }}
                        />
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{ minWidth: 70, textAlign: "right" }}
                        >
                          {option.vote_count} vote
                          {option.vote_count === 1 ? "" : "s"}
                        </Typography>
                      </Box>
                    </Box>
                  );
                })}
            </Stack>
          )}
        </Box>

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
