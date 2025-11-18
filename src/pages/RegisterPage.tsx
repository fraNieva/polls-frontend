import React, { useState } from "react";
import { Box, TextField, Alert } from "@mui/material";
import { PersonAdd as PersonAddIcon } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import {
  AuthPageHeader,
  EmailField,
  PasswordField,
  AuthSubmitButton,
  AuthErrorAlert,
  AuthFooterLinks,
} from "../components";
import { useAuthForm } from "../hooks/useAuthForm";
import { usePasswordToggle } from "../hooks/usePasswordToggle";
import { validateRegisterForm } from "../utils/authValidation";
import { useAppDispatch, useAppSelector } from "../store";
import { registerUser, clearError } from "../store/slices/authSlice";

interface RegisterFormData extends Record<string, string> {
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export const RegisterPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { isLoading, error } = useAppSelector((state) => state.auth);
  const [registrationSuccess, setRegistrationSuccess] = useState(false);

  const { showPassword, togglePasswordVisibility: togglePassword } =
    usePasswordToggle();
  const {
    showPassword: showConfirmPassword,
    togglePasswordVisibility: toggleConfirmPassword,
  } = usePasswordToggle();

  const {
    formData,
    handleSubmit,
    createInputHandler,
    createBlurHandler,
    shouldShowFieldError,
    getFieldErrorMessage,
  } = useAuthForm<RegisterFormData>({
    fields: [
      "firstName",
      "lastName",
      "username",
      "email",
      "password",
      "confirmPassword",
    ],
    validateForm: validateRegisterForm,
    onSubmit: async (data) => {
      const { firstName, lastName, username, email, password } = data;
      const full_name = `${firstName} ${lastName}`.trim();

      try {
        await dispatch(
          registerUser({
            username,
            email,
            password,
            full_name,
          })
        ).unwrap();

        // Registration successful
        setRegistrationSuccess(true);

        // Redirect to login after 3 seconds
        setTimeout(() => {
          navigate("/login", {
            state: {
              message:
                "Account created successfully! Please sign in to continue.",
            },
          });
        }, 3000);
      } catch (error) {
        // Error is already handled by the thunk and stored in Redux state
        console.error("Registration failed:", error);
      }
    },
  });

  const handleDismissError = () => {
    dispatch(clearError());
  };

  // Show success message if registration completed
  if (registrationSuccess) {
    return (
      <Box
        sx={{
          maxWidth: 400,
          mx: "auto",
          mt: 8,
          p: 3,
          textAlign: "center",
        }}
      >
        <AuthPageHeader
          icon={PersonAddIcon}
          title="Account Created!"
          subtitle="Welcome to Polls App"
        />

        <Alert severity="success" sx={{ mb: 3 }}>
          Your account has been created successfully. You will be redirected to
          the login page in a few seconds.
        </Alert>

        <AuthFooterLinks
          primaryLink={{
            text: "Continue to",
            link: { text: "Sign In", to: "/login" },
          }}
        />
      </Box>
    );
  }

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{
        maxWidth: 400,
        mx: "auto",
        mt: 8,
        p: 3,
        display: "flex",
        flexDirection: "column",
        gap: 2,
      }}
    >
      <AuthPageHeader
        icon={PersonAddIcon}
        title="Create Account"
        subtitle="Join us today and start creating polls"
      />

      <AuthErrorAlert error={error} onDismiss={handleDismissError} />

      <Box sx={{ display: "flex", gap: 2 }}>
        <TextField
          name="firstName"
          label="First Name"
          type="text"
          value={formData.firstName}
          onChange={createInputHandler("firstName")}
          onBlur={createBlurHandler("firstName")}
          error={shouldShowFieldError("firstName")}
          helperText={getFieldErrorMessage("firstName")}
          fullWidth
          required
        />
        <TextField
          name="lastName"
          label="Last Name"
          type="text"
          value={formData.lastName}
          onChange={createInputHandler("lastName")}
          onBlur={createBlurHandler("lastName")}
          error={shouldShowFieldError("lastName")}
          helperText={getFieldErrorMessage("lastName")}
          fullWidth
          required
        />
      </Box>

      <TextField
        name="username"
        label="Username"
        type="text"
        value={formData.username}
        onChange={createInputHandler("username")}
        onBlur={createBlurHandler("username")}
        error={shouldShowFieldError("username")}
        helperText={getFieldErrorMessage("username")}
        fullWidth
        required
      />

      <EmailField
        value={formData.email}
        onChange={createInputHandler("email")}
        onBlur={createBlurHandler("email")}
        error={shouldShowFieldError("email")}
        helperText={getFieldErrorMessage("email")}
      />

      <PasswordField
        value={formData.password}
        onChange={createInputHandler("password")}
        onBlur={createBlurHandler("password")}
        error={shouldShowFieldError("password")}
        helperText={getFieldErrorMessage("password")}
        showPassword={showPassword}
        onToggleVisibility={togglePassword}
        label="Password"
      />

      <PasswordField
        value={formData.confirmPassword}
        onChange={createInputHandler("confirmPassword")}
        onBlur={createBlurHandler("confirmPassword")}
        error={shouldShowFieldError("confirmPassword")}
        helperText={getFieldErrorMessage("confirmPassword")}
        showPassword={showConfirmPassword}
        onToggleVisibility={toggleConfirmPassword}
        label="Confirm Password"
        autoComplete="new-password"
      />

      <AuthSubmitButton isLoading={isLoading} loadingText="Creating Account...">
        Create Account
      </AuthSubmitButton>

      <AuthFooterLinks
        primaryLink={{
          text: "Already have an account?",
          link: { text: "Sign in here", to: "/login" },
        }}
      />
    </Box>
  );
};
