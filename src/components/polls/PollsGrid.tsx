import { Box } from "@mui/material";
import { PollCard } from "./PollCard";
import type { Poll } from "../../types/poll";

interface PollsGridProps {
  polls: Poll[];
  onVote?: (pollId: number, optionId: number) => void;
}

/**
 * Grid component for displaying polls in a responsive layout
 */
export const PollsGrid = ({ polls, onVote }: PollsGridProps) => {
  const handleVote = (pollId: number, optionId?: number) => {
    if (onVote && optionId) {
      onVote(pollId, optionId);
    } else {
      // Fallback for development
      console.log("Vote action triggered for poll:", pollId);
    }
  };

  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: {
          xs: "1fr",
          sm: "repeat(auto-fill, minmax(300px, 1fr))",
          md: "repeat(auto-fill, minmax(350px, 1fr))",
        },
        gap: 3,
        mb: 4,
      }}
    >
      {polls.map((poll) => (
        <PollCard
          key={poll.id}
          poll={poll}
          onVote={() => handleVote(poll.id)}
        />
      ))}
    </Box>
  );
};
