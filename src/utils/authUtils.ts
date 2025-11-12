/**
 * Authentication utility functions
 * Helper functions for auth-related operations
 */

/**
 * Auth form field types
 */
export type AuthFormField =
  | "email"
  | "password"
  | "confirmPassword"
  | "firstName"
  | "lastName";

/**
 * Common auth form data structures
 */
export interface LoginFormData {
  email: string;
  password: string;
}

export interface RegisterFormData {
  email: string;
  password: string;
  confirmPassword: string;
  firstName: string;
  lastName: string;
}

export interface ResetPasswordFormData {
  email: string;
}

export interface ChangePasswordFormData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

/**
 * Form error types
 */
export type FormErrors<T> = Partial<Record<keyof T, string>>;

/**
 * Touched fields tracking
 */
export type TouchedFields<T> = Partial<Record<keyof T, boolean>>;

/**
 * Form field configuration
 */
export interface FormFieldConfig {
  label: string;
  type: "email" | "password" | "text";
  autoComplete: string;
  placeholder?: string;
  autoFocus?: boolean;
}

/**
 * Auth form field configurations
 */
export const AUTH_FIELD_CONFIGS: Record<AuthFormField, FormFieldConfig> = {
  email: {
    label: "Email Address",
    type: "email",
    autoComplete: "email",
    placeholder: "Enter your email address",
    autoFocus: true,
  },
  password: {
    label: "Password",
    type: "password",
    autoComplete: "current-password",
    placeholder: "Enter your password",
  },
  confirmPassword: {
    label: "Confirm Password",
    type: "password",
    autoComplete: "new-password",
    placeholder: "Confirm your password",
  },
  firstName: {
    label: "First Name",
    type: "text",
    autoComplete: "given-name",
    placeholder: "Enter your first name",
  },
  lastName: {
    label: "Last Name",
    type: "text",
    autoComplete: "family-name",
    placeholder: "Enter your last name",
  },
};

/**
 * Get redirect path after authentication
 */
export const getRedirectPath = (
  locationState?: { from?: { pathname: string } },
  defaultPath = "/polls"
): string => {
  return locationState?.from?.pathname || defaultPath;
};

/**
 * Create initial form data
 */
export const createInitialFormData = <T extends Record<string, string>>(
  fields: (keyof T)[]
): T => {
  return fields.reduce((acc, field) => {
    acc[field] = "" as T[keyof T];
    return acc;
  }, {} as T);
};

/**
 * Create initial touched state
 */
export const createInitialTouchedState = <T extends Record<string, string>>(
  fields: (keyof T)[]
): TouchedFields<T> => {
  return fields.reduce((acc, field) => {
    acc[field] = false;
    return acc;
  }, {} as TouchedFields<T>);
};

/**
 * Mark all fields as touched
 */
export const markAllFieldsTouched = <T extends Record<string, string>>(
  fields: (keyof T)[]
): TouchedFields<T> => {
  return fields.reduce((acc, field) => {
    acc[field] = true;
    return acc;
  }, {} as TouchedFields<T>);
};

/**
 * Check if field should show error
 */
export const shouldShowFieldError = <T extends Record<string, string>>(
  field: keyof T,
  errors: FormErrors<T>,
  touched: TouchedFields<T>
): boolean => {
  return !!(touched[field] && errors[field]);
};

/**
 * Get field error message
 */
export const getFieldErrorMessage = <T extends Record<string, string>>(
  field: keyof T,
  errors: FormErrors<T>,
  touched: TouchedFields<T>
): string | undefined => {
  return shouldShowFieldError(field, errors, touched)
    ? errors[field]
    : undefined;
};

/**
 * Format auth error message for display
 */
export const formatAuthErrorMessage = (error: string | null): string | null => {
  if (!error) return null;

  // Common backend error message mappings
  const errorMappings: Record<string, string> = {
    "Invalid credentials": "Invalid email or password. Please try again.",
    "User not found": "No account found with this email address.",
    "Email already exists":
      "An account with this email address already exists.",
    "Token expired": "Your session has expired. Please log in again.",
    "Invalid token": "Invalid or expired token. Please try again.",
    "Network Error":
      "Connection failed. Please check your internet connection.",
    "Request timeout": "Request timed out. Please try again.",
  };

  return errorMappings[error] || error;
};

/**
 * Create form submission handler
 */
export const createFormSubmissionHandler = <T extends Record<string, string>>(
  formData: T,
  validateForm: () => boolean,
  markAllTouched: () => void,
  onSubmit: (data: T) => Promise<void> | void,
  onError?: (error: Error) => void
) => {
  return async (event: React.FormEvent) => {
    event.preventDefault();

    // Mark all fields as touched for validation display
    markAllTouched();

    // Validate form before submission
    if (!validateForm()) {
      return;
    }

    try {
      await onSubmit(formData);
    } catch (error) {
      console.error("Form submission error:", error);
      onError?.(error as Error);
    }
  };
};

/**
 * Create input change handler
 */
export const createInputChangeHandler = <T extends Record<string, string>>(
  field: keyof T,
  setFormData: React.Dispatch<React.SetStateAction<T>>,
  setFormErrors: React.Dispatch<React.SetStateAction<FormErrors<T>>>,
  formErrors: FormErrors<T>
) => {
  return (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;

    // Update form data
    setFormData((prev) => ({ ...prev, [field]: value }));

    // Clear field error when user starts typing
    if (formErrors[field]) {
      setFormErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };
};

/**
 * Create field blur handler
 */
export const createFieldBlurHandler = <T extends Record<string, string>>(
  field: keyof T,
  setTouched: React.Dispatch<React.SetStateAction<TouchedFields<T>>>
) => {
  return () => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  };
};

/**
 * Extract error message from error object
 */
export const extractErrorMessage = (error: unknown): string => {
  if (error instanceof Error) {
    return error.message;
  }

  if (typeof error === "string") {
    return error;
  }

  if (error && typeof error === "object" && "message" in error) {
    return String((error as { message: unknown }).message);
  }

  return "An unexpected error occurred";
};

/**
 * Demo credentials for development
 */
export const DEMO_CREDENTIALS = {
  email: "bob@example.com",
  password: "bob123",
} as const;
