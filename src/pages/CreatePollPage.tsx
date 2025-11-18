import { useState } from "react";
import type { FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../store";
import { createPoll } from "../store/slices/pollsSlice";
import { usePollForm } from "../hooks/usePollForm";
import { extractApiError } from "../utils/apiErrors";
import {
  Box,
  Container,
  Paper,
  Typography,
  Alert,
  FormControlLabel,
  Switch,
} from "@mui/material";
import {
  PollTitleField,
  PollDescriptionField,
  PollOptionsManager,
  PollVisibilityToggle,
  PollSubmitButton,
} from "../components/poll-create";

/**
 * CreatePollPage - Main page for creating new polls
 *
 * Features:
 * - Poll title and description
 * - Optional poll options (can add later)
 * - Public/private visibility toggle
 * - Active/inactive status toggle
 * - Form validation
 * - Success/error feedback
 * - Navigation after creation
 *
 * Following modular architecture pattern:
 * - Uses usePollForm hook for state management
 * - Separates concerns into reusable components
 * - Redux integration for API calls
 * - Error handling with extractApiError
 */
export const CreatePollPage = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { isLoading } = useAppSelector((state) => state.polls);

  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const {
    formData,
    errors,
    touched,
    isValid,
    handleTitleChange,
    handleDescriptionChange,
    handleOptionsChange,
    handleIsPublicChange,
    handleIsActiveChange,
    handleTitleBlur,
    handleDescriptionBlur,
    resetForm,
  } = usePollForm();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!isValid) {
      setError("Please fix all errors before submitting");
      return;
    }

    try {
      const result = await dispatch(
        createPoll({
          title: formData.title.trim(),
          description: formData.description.trim() || undefined,
          is_active: formData.isActive,
          is_public: formData.isPublic,
          options: formData.options.length > 0 ? formData.options : undefined,
        })
      ).unwrap();

      setSuccess("Poll created successfully!");
      resetForm();

      // Navigate to the created poll after a short delay
      setTimeout(() => {
        navigate(`/polls/${result.id}`);
      }, 1500);
    } catch (err) {
      const errorMessage = extractApiError(err, "Failed to create poll");
      setError(errorMessage);
    }
  };

  return (
    <Container maxWidth="md">
      <Box sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Create New Poll
        </Typography>

        <Paper sx={{ p: 3, mt: 3 }}>
          {error && (
            <Alert
              severity="error"
              sx={{ mb: 2 }}
              onClose={() => setError(null)}
            >
              {error}
            </Alert>
          )}

          {success && (
            <Alert severity="success" sx={{ mb: 2 }}>
              {success}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit} noValidate>
            {/* Title field */}
            <PollTitleField
              value={formData.title}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                handleTitleChange(e.target.value)
              }
              onBlur={handleTitleBlur}
              error={touched.title && !!errors.title}
              helperText={touched.title ? errors.title : undefined}
              disabled={isLoading}
            />

            {/* Description field */}
            <PollDescriptionField
              value={formData.description}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                handleDescriptionChange(e.target.value)
              }
              onBlur={handleDescriptionBlur}
              error={touched.description && !!errors.description}
              helperText={touched.description ? errors.description : undefined}
              disabled={isLoading}
            />

            {/* Options manager */}
            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle2" gutterBottom>
                Poll Options (Optional)
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                You can add options now or add them later. Options help users
                vote on specific choices.
              </Typography>
              <PollOptionsManager
                options={formData.options}
                onOptionsChange={handleOptionsChange}
                error={touched.options ? errors.options : undefined}
                disabled={isLoading}
              />
            </Box>

            {/* Visibility toggle */}
            <PollVisibilityToggle
              isPublic={formData.isPublic}
              onChange={handleIsPublicChange}
              disabled={isLoading}
            />

            {/* Active status toggle */}
            <FormControlLabel
              control={
                <Switch
                  checked={formData.isActive}
                  onChange={(e) => handleIsActiveChange(e.target.checked)}
                  disabled={isLoading}
                />
              }
              label={
                <Box>
                  <Typography variant="body1">Active Poll</Typography>
                  <Typography variant="body2" color="text.secondary">
                    {formData.isActive
                      ? "Poll is active and can receive votes"
                      : "Poll is inactive and cannot receive votes"}
                  </Typography>
                </Box>
              }
              sx={{ mb: 3 }}
            />

            {/* Submit button */}
            <PollSubmitButton isLoading={isLoading} disabled={!isValid}>
              Create Poll
            </PollSubmitButton>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};
