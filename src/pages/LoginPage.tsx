import { useCallback } from "react";
import { Container, Paper, Stack, Box } from "@mui/material";
import { Login as LoginIcon } from "@mui/icons-material";
import { useAppDispatch, useAppSelector } from "../store";
import { loginUser, clearError } from "../store/slices/authSlice";
import {
  AuthPageHeader,
  AuthErrorAlert,
  EmailField,
  PasswordField,
  AuthSubmitButton,
  AuthFooterLinks,
} from "../components";
import { useAuthForm, usePasswordToggle, useAuthRedirect } from "../hooks";
import { validateEmail, validatePassword } from "../utils/authValidation";
import type { FormErrors } from "../utils/authUtils";

/**
 * Login form data interface
 */
interface LoginFormData extends Record<string, string> {
  email: string;
  password: string;
}

/**
 * Validate login form data
 */
const validateLoginForm = (data: LoginFormData): FormErrors<LoginFormData> => {
  const errors: FormErrors<LoginFormData> = {};

  const emailError = validateEmail(data.email);
  if (emailError) errors.email = emailError;

  const passwordError = validatePassword(data.password);
  if (passwordError) errors.password = passwordError;

  return errors;
};

/**
 * Login page component
 * Provides user authentication with email and password
 */
export const LoginPage = () => {
  const dispatch = useAppDispatch();
  const { isLoading, error } = useAppSelector((state) => state.auth);

  // Handle post-authentication redirect
  useAuthRedirect();

  // Password visibility management
  const { showPassword, togglePasswordVisibility } = usePasswordToggle();

  // Form state and validation management
  const {
    formData,
    handleSubmit,
    createInputHandler,
    createBlurHandler,
    shouldShowFieldError,
    getFieldErrorMessage,
  } = useAuthForm<LoginFormData>({
    fields: ["email", "password"],
    validateForm: validateLoginForm,
    onSubmit: async (data) => {
      const result = await dispatch(loginUser(data));
      if (result.type === "auth/login/fulfilled") {
        console.log("Login successful");
      }
    },
  });

  // Clear error handler
  const handleClearError = useCallback(() => {
    dispatch(clearError());
  }, [dispatch]);

  // Handle enter key press for form submission
  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent) => {
      if (event.key === "Enter") {
        handleSubmit(event as React.FormEvent);
      }
    },
    [handleSubmit]
  );

  return (
    <Container maxWidth="sm" sx={{ py: 8 }}>
      <Paper
        elevation={3}
        sx={{
          p: 4,
          borderRadius: 2,
          backgroundColor: "background.paper",
        }}
      >
        {/* Header */}
        <AuthPageHeader
          icon={LoginIcon}
          title="Welcome Back"
          subtitle="Sign in to your account to continue"
        />

        {/* Error Alert */}
        <AuthErrorAlert error={error} onDismiss={handleClearError} />

        {/* Login Form */}
        <Box
          component="form"
          onSubmit={handleSubmit}
          onKeyDown={handleKeyDown}
          noValidate
        >
          <Stack spacing={3}>
            {/* Email Field */}
            <EmailField
              value={formData.email}
              onChange={createInputHandler("email")}
              onBlur={createBlurHandler("email")}
              error={shouldShowFieldError("email")}
              helperText={getFieldErrorMessage("email")}
              disabled={isLoading}
              autoFocus
            />

            {/* Password Field */}
            <PasswordField
              value={formData.password}
              onChange={createInputHandler("password")}
              onBlur={createBlurHandler("password")}
              error={shouldShowFieldError("password")}
              helperText={getFieldErrorMessage("password")}
              disabled={isLoading}
              showPassword={showPassword}
              onToggleVisibility={togglePasswordVisibility}
            />

            {/* Submit Button */}
            <AuthSubmitButton isLoading={isLoading} loadingText="Signing In...">
              Sign In
            </AuthSubmitButton>
          </Stack>
        </Box>

        {/* Footer Links */}
        <AuthFooterLinks
          primaryLink={{
            text: "Don't have an account?",
            link: { text: "Sign Up", to: "/register" },
          }}
          secondaryLink={{
            text: "Forgot your password?",
            to: "#",
            external: true,
          }}
          showDemoCredentials={true}
        />
      </Paper>
    </Container>
  );
};
