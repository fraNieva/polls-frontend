import { useState } from "react";
import {
  Box,
  TextField,
  IconButton,
  Button,
  Typography,
  List,
  ListItem,
  ListItemText,
  Paper,
} from "@mui/material";
import { Delete as DeleteIcon, Add as AddIcon } from "@mui/icons-material";

interface PollOptionsManagerProps {
  options: string[];
  onOptionsChange: (options: string[]) => void;
  error?: string;
  disabled?: boolean;
}

/**
 * Manager for poll options with add/remove functionality
 *
 * Features:
 * - Add new options (max 10)
 * - Remove options
 * - Duplicate detection
 * - Min 2 options validation
 * - Individual option validation (1-100 chars)
 *
 * @example
 * ```tsx
 * <PollOptionsManager
 *   options={formData.options}
 *   onOptionsChange={handleOptionsChange}
 *   error={errors.options}
 * />
 * ```
 */
export const PollOptionsManager = ({
  options,
  onOptionsChange,
  error,
  disabled = false,
}: PollOptionsManagerProps) => {
  const [newOption, setNewOption] = useState("");
  const [localError, setLocalError] = useState<string>("");

  const handleAddOption = () => {
    const trimmedOption = newOption.trim();

    // Validation
    if (!trimmedOption) {
      setLocalError("Option cannot be empty");
      return;
    }

    if (trimmedOption.length < 1 || trimmedOption.length > 100) {
      setLocalError("Option must be 1-100 characters");
      return;
    }

    if (options.length >= 10) {
      setLocalError("Maximum 10 options allowed");
      return;
    }

    // Check for duplicates (case-insensitive)
    if (
      options.some((opt) => opt.toLowerCase() === trimmedOption.toLowerCase())
    ) {
      setLocalError("This option already exists");
      return;
    }

    onOptionsChange([...options, trimmedOption]);
    setNewOption("");
    setLocalError("");
  };

  const handleRemoveOption = (index: number) => {
    const newOptions = options.filter((_, i) => i !== index);
    onOptionsChange(newOptions);
  };

  return (
    <Box>
      <Typography variant="subtitle1" gutterBottom>
        Poll Options {options.length < 2 && "(minimum 2 required)"}
      </Typography>

      {/* Add option field */}
      <Box sx={{ display: "flex", gap: 1, mb: 2 }}>
        <TextField
          fullWidth
          size="small"
          label="Add option"
          value={newOption}
          onChange={(e) => {
            setNewOption(e.target.value);
            setLocalError("");
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              handleAddOption();
            }
          }}
          error={!!localError}
          helperText={localError || `${options.length}/10 options`}
          disabled={disabled || options.length >= 10}
          slotProps={{
            htmlInput: {
              maxLength: 100,
            },
          }}
        />
        <Button
          variant="contained"
          onClick={handleAddOption}
          disabled={disabled || !newOption.trim() || options.length >= 10}
          startIcon={<AddIcon />}
          sx={{ minWidth: 100 }}
        >
          Add
        </Button>
      </Box>

      {/* Options list */}
      {options.length > 0 && (
        <Paper variant="outlined" sx={{ maxHeight: 300, overflow: "auto" }}>
          <List dense>
            {options.map((option, index) => (
              <ListItem
                key={`option-${option}-${index}`}
                divider={index < options.length - 1}
                secondaryAction={
                  <IconButton
                    edge="end"
                    size="small"
                    onClick={() => handleRemoveOption(index)}
                    disabled={disabled}
                    aria-label={`Remove option ${index + 1}`}
                  >
                    <DeleteIcon />
                  </IconButton>
                }
              >
                <ListItemText
                  primary={option}
                  secondary={`Option ${index + 1}`}
                />
              </ListItem>
            ))}
          </List>
        </Paper>
      )}

      {/* Global error */}
      {error && (
        <Typography
          variant="caption"
          color="error"
          sx={{ display: "block", mt: 1 }}
        >
          {error}
        </Typography>
      )}

      {/* Helper text */}
      {options.length === 0 && (
        <Typography
          variant="caption"
          color="text.secondary"
          sx={{ display: "block", mt: 1 }}
        >
          Add at least 2 options for your poll. You can add up to 10 options.
        </Typography>
      )}
    </Box>
  );
};
