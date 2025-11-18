import { useState } from "react";
import {
  Box,
  Button,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  Typography,
  CircularProgress,
} from "@mui/material";
import { Check } from "@mui/icons-material";
import type { PollOption } from "../../types/poll";

/**
 * Props for PollVotingForm component
 */
export interface PollVotingFormProps {
  /** Array of poll options */
  options: PollOption[];
  /** Callback when vote is submitted */
  onVote: (optionId: number) => void;
  /** Whether voting is in progress */
  isVoting?: boolean;
  /** Initially selected option ID */
  initialSelectedId?: number | null;
}

/**
 * Poll Voting Form Component
 * Interactive radio button interface for voting
 *
 * @example
 * ```tsx
 * <PollVotingForm
 *   options={pollOptions}
 *   onVote={(optionId) => handleVote(optionId)}
 *   isVoting={false}
 * />
 * ```
 */
export const PollVotingForm = ({
  options,
  onVote,
  isVoting = false,
  initialSelectedId = null,
}: PollVotingFormProps) => {
  const [selectedOptionId, setSelectedOptionId] = useState<number | null>(
    initialSelectedId
  );

  const handleSubmit = () => {
    if (selectedOptionId) {
      onVote(selectedOptionId);
    }
  };

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Cast Your Vote
      </Typography>

      <FormControl component="fieldset" fullWidth sx={{ mt: 2 }}>
        <RadioGroup
          value={selectedOptionId}
          onChange={(e) => setSelectedOptionId(Number(e.target.value))}
        >
          {options.map((option: PollOption) => (
            <Box key={option.id} sx={{ mb: 2 }}>
              <FormControlLabel
                value={option.id}
                control={<Radio />}
                label={<Typography variant="body1">{option.text}</Typography>}
                sx={{
                  border: "1px solid",
                  borderColor:
                    selectedOptionId === option.id ? "primary.main" : "divider",
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
          onClick={handleSubmit}
          disabled={!selectedOptionId || isVoting}
          startIcon={isVoting ? <CircularProgress size={20} /> : <Check />}
          sx={{ mt: 2 }}
        >
          {isVoting ? "Submitting..." : "Submit Vote"}
        </Button>
      </FormControl>
    </Box>
  );
};
