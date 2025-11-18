import { useState, useEffect, useCallback } from "react";
import {
  Container,
  Paper,
  Box,
  Button,
  Alert,
  Divider,
  Snackbar,
} from "@mui/material";
import { Edit } from "@mui/icons-material";
import { useAppSelector, useAppDispatch } from "../store";
import { updateUserProfile, clearError } from "../store/slices/authSlice";
import {
  ProfileHeader,
  ProfileInfo,
  ProfileEditForm,
  ProfileStats,
} from "../components";
import { useProfileForm } from "../hooks";

// Validation function for profile form
const validateProfileForm = (data: {
  username: string;
  email: string;
  full_name: string;
}) => {
  const errors: Record<string, string> = {};

  // Username validation
  if (!data.username || data.username.trim().length < 3) {
    errors.username = "Username must be at least 3 characters";
  } else if (data.username.length > 50) {
    errors.username = "Username must be less than 50 characters";
  }

  // Email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!data.email || !emailRegex.test(data.email)) {
    errors.email = "Please enter a valid email address";
  }

  // Full name validation (optional but if provided should be valid)
  if (data.full_name && data.full_name.length > 100) {
    errors.full_name = "Full name must be less than 100 characters";
  }

  return errors;
};

export const ProfilePage = () => {
  const dispatch = useAppDispatch();
  const { user, isLoading, error } = useAppSelector((state) => state.auth);
  const [isEditing, setIsEditing] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Initialize form with user data
  const {
    formData,
    errors,
    isSubmitting,
    hasChanges,
    createInputHandler,
    handleSubmit,
    resetForm,
    updateInitialData,
  } = useProfileForm({
    initialData: {
      username: user?.username || "",
      email: user?.email || "",
      full_name: user?.full_name || "",
    },
    onSubmit: async (data) => {
      try {
        await dispatch(updateUserProfile(data)).unwrap();
        setSuccessMessage("Profile updated successfully!");
        setIsEditing(false);
      } catch (err) {
        // Error is handled by Redux and displayed via error state
        console.error("Failed to update profile:", err);
      }
    },
    validateForm: validateProfileForm,
  });

  // Update form when user data changes
  useEffect(() => {
    if (user) {
      updateInitialData({
        username: user.username,
        email: user.email,
        full_name: user.full_name,
      });
    }
  }, [user, updateInitialData]);

  // Handle edit mode toggle
  const handleEditClick = useCallback(() => {
    setIsEditing(true);
    dispatch(clearError());
  }, [dispatch]);

  const handleCancelEdit = useCallback(() => {
    setIsEditing(false);
    resetForm();
    dispatch(clearError());
  }, [resetForm, dispatch]);

  // Auto-dismiss success message
  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => setSuccessMessage(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [successMessage]);

  if (!user) {
    return (
      <Container maxWidth="md">
        <Alert severity="error">
          Unable to load profile. Please try logging in again.
        </Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="md">
      <Paper sx={{ p: 4, mt: 4 }}>
        {/* Profile Header */}
        <ProfileHeader username={user.username} email={user.email} />

        {/* Success Message */}
        {successMessage && (
          <Alert
            severity="success"
            sx={{ mb: 3 }}
            onClose={() => setSuccessMessage(null)}
          >
            {successMessage}
          </Alert>
        )}

        {/* Error Message */}
        {error && (
          <Alert
            severity="error"
            sx={{ mb: 3 }}
            onClose={() => dispatch(clearError())}
          >
            {error}
          </Alert>
        )}

        {/* Edit Mode or View Mode */}
        {isEditing ? (
          <ProfileEditForm
            formData={formData}
            errors={errors}
            isLoading={isSubmitting || isLoading}
            onSubmit={handleSubmit}
            onChange={createInputHandler}
            onCancel={handleCancelEdit}
            hasChanges={hasChanges}
          />
        ) : (
          <>
            <Box sx={{ mb: 3, display: "flex", justifyContent: "flex-end" }}>
              <Button
                variant="contained"
                startIcon={<Edit />}
                onClick={handleEditClick}
              >
                Edit Profile
              </Button>
            </Box>

            <ProfileInfo
              fullName={user.full_name}
              isActive={user.is_active}
              createdAt={user.created_at || undefined}
              updatedAt={user.updated_at || undefined}
            />
          </>
        )}

        <Divider sx={{ my: 4 }} />

        {/* Statistics Section */}
        <ProfileStats pollsCreated={0} totalVotes={0} activePollsCount={0} />
      </Paper>

      {/* Snackbar for non-intrusive success messages */}
      <Snackbar
        open={!!successMessage}
        autoHideDuration={5000}
        onClose={() => setSuccessMessage(null)}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert severity="success" onClose={() => setSuccessMessage(null)}>
          {successMessage}
        </Alert>
      </Snackbar>
    </Container>
  );
};
