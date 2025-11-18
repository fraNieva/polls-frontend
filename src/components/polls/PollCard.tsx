import {
  Card,
  CardContent,
  CardActions,
  Typography,
  Button,
  Box,
  Chip,
  Avatar,
  LinearProgress,
} from "@mui/material";
import { Poll as PollIcon, HowToVote } from "@mui/icons-material";
import { Link } from "react-router-dom";
import type { Poll, PollOption } from "../../types/poll";
import { PollMetadata } from "../poll-detail/PollMetadata";

interface PollCardProps {
  poll: Poll;
  showVoteButton?: boolean;
  onVote?: (pollId: number, optionId: number) => void;
}

export const PollCard = ({ poll, showVoteButton = true }: PollCardProps) => {
  const topOption = poll.options.reduce(
    (max: PollOption, option: PollOption) =>
      option.vote_count > max.vote_count ? option : max,
    poll.options[0]
  );

  return (
    <Card
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        transition: "all 0.2s ease-in-out",
        "&:hover": {
          transform: "translateY(-2px)",
          boxShadow: 4,
        },
      }}
    >
      <CardContent sx={{ flexGrow: 1 }}>
        {/* Poll Header */}
        <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
          <Avatar
            sx={{ bgcolor: "primary.main", mr: 2, width: 32, height: 32 }}
          >
            <PollIcon fontSize="small" />
          </Avatar>
          <Box sx={{ flexGrow: 1 }}>
            <Typography variant="h6" component="h2" gutterBottom>
              {poll.title}
            </Typography>
            {poll.description && (
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  display: "-webkit-box",
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: "vertical",
                }}
              >
                {poll.description}
              </Typography>
            )}
          </Box>
        </Box>

        {/* Poll Stats */}
        <PollMetadata
          totalVotes={poll.total_votes}
          pubDate={poll.pub_date}
          variant="compact"
        />

        {/* Top Option Preview */}
        {topOption && poll.total_votes > 0 && (
          <Box sx={{ mb: 2 }}>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Leading option:
            </Typography>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
              <Typography variant="body2" sx={{ flexGrow: 1 }}>
                {topOption.text}
              </Typography>
              <Typography variant="body2" color="primary">
                {topOption.percentage.toFixed(1)}%
              </Typography>
            </Box>
            <LinearProgress
              variant="determinate"
              value={topOption.percentage}
              sx={{ height: 6, borderRadius: 3 }}
            />
          </Box>
        )}

        {/* Status Chips */}
        <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
          {poll.user_has_voted && (
            <Chip
              label="Voted"
              size="small"
              color="success"
              variant="outlined"
              icon={<HowToVote />}
            />
          )}
          {!poll.is_active && (
            <Chip
              label="Closed"
              size="small"
              color="error"
              variant="outlined"
            />
          )}
          <Chip
            label={`${poll.options.length} option${
              poll.options.length === 1 ? "" : "s"
            }`}
            size="small"
            variant="outlined"
          />
        </Box>
      </CardContent>

      <CardActions sx={{ justifyContent: "space-between", px: 2, pb: 2 }}>
        <Button
          component={Link}
          to={`/polls/${poll.id}`}
          size="small"
          variant="outlined"
        >
          View Details
        </Button>

        {showVoteButton && poll.is_active && !poll.user_has_voted && (
          <Button
            component={Link}
            to={`/polls/${poll.id}`}
            size="small"
            variant="contained"
            startIcon={<HowToVote />}
          >
            Vote Now
          </Button>
        )}
      </CardActions>
    </Card>
  );
};
