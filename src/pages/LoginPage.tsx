import {
  useState,
  useEffect,
  useCallback,
} from "react";
import {
  Typography,
  Box,
  Paper,
  TextField,
  Button,
  Alert,
  Container,
  Link,
  CircularProgress,
  InputAdornment,
  IconButton,
  Divider,
  Stack,
} from "@mui/material";
import {
  Email as EmailIcon,
  Lock as LockIcon,
  Visibility,
  VisibilityOff,
  Login as LoginIcon,
} from "@mui/icons-material";
import { Link as RouterLink, useNavigate, useLocation } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../store";
import { loginUser, clearError } from "../store/slices/authSlice";

interface LoginFormData {
  email: string;
  password: string;
}

interface FormErrors {
  email?: string;
  password?: string;
}

export const LoginPage = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  
  const { isLoading, error, isAuthenticated } = useAppSelector(
    (state) => state.auth
  );

  // Form state
  const [formData, setFormData] = useState<LoginFormData>({
    email: "",
    password: "",
  });
  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const [showPassword, setShowPassword] = useState(false);
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  // Redirect after successful login
  useEffect(() => {
    if (isAuthenticated) {
      const from = location.state?.from?.pathname || "/polls";
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, location.state?.from?.pathname]);

  // Clear auth errors when component mounts
  useEffect(() => {
    dispatch(clearError());
  }, [dispatch]);

  // Form validation
  const validateForm = useCallback((): boolean => {
    const errors: FormErrors = {};

    // Email validation
    if (!formData.email) {
      errors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = "Please enter a valid email address";
    }

    // Password validation
    if (!formData.password) {
      errors.password = "Password is required";
    } else if (formData.password.length < 6) {
      errors.password = "Password must be at least 6 characters long";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  }, [formData]);

  // Handle input changes
  const handleInputChange = useCallback(
    (field: keyof LoginFormData) => (event: React.ChangeEvent<HTMLInputElement>) => {
      const value = event.target.value;
      setFormData((prev) => ({ ...prev, [field]: value }));

      // Clear field error when user starts typing
      if (formErrors[field]) {
        setFormErrors((prev) => ({ ...prev, [field]: undefined }));
      }
    },
    [formErrors]
  );

  // Handle field blur for validation feedback
  const handleFieldBlur = useCallback(
    (field: keyof LoginFormData) => () => {
      setTouched((prev) => ({ ...prev, [field]: true }));
    },
    []
  );

  // Handle form submission
  const handleSubmit = useCallback(
    async (event: React.FormEvent) => {
      event.preventDefault();

      // Mark all fields as touched for validation display
      setTouched({ email: true, password: true });

      if (!validateForm()) {
        return;
      }

      try {
        const result = await dispatch(loginUser(formData));
        
        if (result.type === "auth/login/fulfilled") {
          // Navigation is handled by useEffect above
          console.log("Login successful");
        }
      } catch (err) {
        // Error handling is managed by Redux slice
        console.error("Login error:", err);
      }
    },
    [formData, validateForm, dispatch]
  );

  // Toggle password visibility
  const handleTogglePasswordVisibility = useCallback(() => {
    setShowPassword((prev) => !prev);
  }, []);

  // Handle error dismissal
  const handleDismissError = useCallback(() => {
    dispatch(clearError());
  }, [dispatch]);

  // Handle enter key press
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
        <Box textAlign="center" mb={4}>
          <LoginIcon sx={{ fontSize: 48, color: "primary.main", mb: 2 }} />
          <Typography variant="h4" component="h1" gutterBottom fontWeight={600}>
            Welcome Back
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Sign in to your account to continue
          </Typography>
        </Box>

        {/* Error Alert */}
        {error && (
          <Alert 
            severity="error" 
            sx={{ mb: 3 }}
            onClose={handleDismissError}
            action={
              <IconButton
                aria-label="close"
                color="inherit"
                size="small"
                onClick={handleDismissError}
              />
            }
          >
            {error}
          </Alert>
        )}

        {/* Login Form */}
        <Box
          component="form"
          onSubmit={handleSubmit}
          onKeyDown={handleKeyDown}
          noValidate
        >
          <Stack spacing={3}>
            {/* Email Field */}
            <TextField
              fullWidth
              label="Email Address"
              type="email"
              variant="outlined"
              value={formData.email}
              onChange={handleInputChange("email")}
              onBlur={handleFieldBlur("email")}
              error={touched.email && !!formErrors.email}
              helperText={touched.email && formErrors.email}
              disabled={isLoading}
              autoComplete="email"
              autoFocus
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <EmailIcon color="action" />
                    </InputAdornment>
                  ),
                },
              }}
              sx={{
                "& .MuiOutlinedInput-root": {
                  "&:hover fieldset": {
                    borderColor: "primary.main",
                  },
                },
              }}
            />

            {/* Password Field */}
            <TextField
              fullWidth
              label="Password"
              type={showPassword ? "text" : "password"}
              variant="outlined"
              value={formData.password}
              onChange={handleInputChange("password")}
              onBlur={handleFieldBlur("password")}
              error={touched.password && !!formErrors.password}
              helperText={touched.password && formErrors.password}
              disabled={isLoading}
              autoComplete="current-password"
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <LockIcon color="action" />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={handleTogglePasswordVisibility}
                        edge="end"
                        disabled={isLoading}
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                },
              }}
              sx={{
                "& .MuiOutlinedInput-root": {
                  "&:hover fieldset": {
                    borderColor: "primary.main",
                  },
                },
              }}
            />

            {/* Submit Button */}
            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              disabled={isLoading}
              sx={{
                py: 1.5,
                fontWeight: 600,
                textTransform: "none",
                fontSize: "1rem",
              }}
            >
              {isLoading ? (
                <Box display="flex" alignItems="center" gap={1}>
                  <CircularProgress size={20} color="inherit" />
                  <span>Signing In...</span>
                </Box>
              ) : (
                "Sign In"
              )}
            </Button>
          </Stack>
        </Box>

        {/* Divider */}
        <Divider sx={{ my: 3 }} />

        {/* Footer Links */}
        <Box textAlign="center">
          <Typography variant="body2" color="text.secondary" mb={2}>
            Don't have an account?{" "}
            <Link
              component={RouterLink}
              to="/register"
              sx={{
                textDecoration: "none",
                fontWeight: 600,
                "&:hover": {
                  textDecoration: "underline",
                },
              }}
            >
              Sign Up
            </Link>
          </Typography>
          
          <Typography variant="body2" color="text.secondary">
            <Link
              href="#"
              sx={{
                textDecoration: "none",
                "&:hover": {
                  textDecoration: "underline",
                },
              }}
            >
              Forgot your password?
            </Link>
          </Typography>
        </Box>

        {/* Demo Credentials (Development Only) */}
        {import.meta.env.DEV && (
          <Box mt={3} p={2} bgcolor="grey.50" borderRadius={1}>
            <Typography variant="caption" display="block" mb={1} fontWeight={600}>
              Demo Credentials:
            </Typography>
            <Typography variant="caption" display="block" color="text.secondary">
              Email: demo@example.com
            </Typography>
            <Typography variant="caption" display="block" color="text.secondary">
              Password: demo123
            </Typography>
          </Box>
        )}
      </Paper>
    </Container>
  );
};
