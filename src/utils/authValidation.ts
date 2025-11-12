/**
 * Authentication validation utilities
 * Provides reusable validation functions for auth forms
 */

export interface ValidationRule {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  custom?: (value: string) => boolean;
}

export interface ValidationError {
  field: string;
  message: string;
}

/**
 * Email validation regex pattern
 * RFC 5322 compliant basic email validation
 */
export const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Password validation rules
 */
export const PASSWORD_RULES = {
  minLength: 6,
  maxLength: 128,
} as const;

/**
 * Validation rules for auth fields
 */
export const AUTH_VALIDATION_RULES = {
  email: {
    required: true,
    pattern: EMAIL_REGEX,
  },
  password: {
    required: true,
    minLength: PASSWORD_RULES.minLength,
    maxLength: PASSWORD_RULES.maxLength,
  },
  confirmPassword: {
    required: true,
    minLength: PASSWORD_RULES.minLength,
  },
  firstName: {
    required: true,
    minLength: 2,
    maxLength: 50,
  },
  lastName: {
    required: true,
    minLength: 2,
    maxLength: 50,
  },
} as const;

/**
 * Validate email address
 */
export const validateEmail = (email: string): string | null => {
  if (!email) {
    return "Email is required";
  }

  if (!EMAIL_REGEX.test(email)) {
    return "Please enter a valid email address";
  }

  return null;
};

/**
 * Validate password
 */
export const validatePassword = (
  password: string,
  fieldName = "Password"
): string | null => {
  if (!password) {
    return `${fieldName} is required`;
  }

  if (password.length < PASSWORD_RULES.minLength) {
    return `${fieldName} must be at least ${PASSWORD_RULES.minLength} characters long`;
  }

  if (password.length > PASSWORD_RULES.maxLength) {
    return `${fieldName} must be no more than ${PASSWORD_RULES.maxLength} characters long`;
  }

  return null;
};

/**
 * Validate password confirmation
 */
export const validatePasswordConfirmation = (
  password: string,
  confirmPassword: string
): string | null => {
  const passwordError = validatePassword(
    confirmPassword,
    "Password confirmation"
  );
  if (passwordError) {
    return passwordError;
  }

  if (password !== confirmPassword) {
    return "Passwords do not match";
  }

  return null;
};

/**
 * Validate name field (first name, last name)
 */
export const validateName = (
  name: string,
  fieldName: string
): string | null => {
  if (!name) {
    return `${fieldName} is required`;
  }

  if (name.trim().length < 2) {
    return `${fieldName} must be at least 2 characters long`;
  }

  if (name.length > 50) {
    return `${fieldName} must be no more than 50 characters long`;
  }

  return null;
};

/**
 * Generic field validator
 */
export const validateField = (
  value: string,
  rules: ValidationRule,
  fieldName: string
): string | null => {
  if (rules.required && !value) {
    return `${fieldName} is required`;
  }

  if (value && rules.minLength && value.length < rules.minLength) {
    return `${fieldName} must be at least ${rules.minLength} characters long`;
  }

  if (value && rules.maxLength && value.length > rules.maxLength) {
    return `${fieldName} must be no more than ${rules.maxLength} characters long`;
  }

  if (value && rules.pattern && !rules.pattern.test(value)) {
    return `Please enter a valid ${fieldName.toLowerCase()}`;
  }

  if (value && rules.custom && !rules.custom(value)) {
    return `${fieldName} format is invalid`;
  }

  return null;
};

/**
 * Validate multiple fields at once
 */
export const validateFields = <T extends Record<string, string>>(
  data: T,
  rules: Record<keyof T, ValidationRule>,
  fieldNames: Record<keyof T, string>
): Record<keyof T, string | null> => {
  const errors = {} as Record<keyof T, string | null>;

  for (const [field, value] of Object.entries(data) as [keyof T, string][]) {
    if (rules[field]) {
      errors[field] = validateField(value, rules[field], fieldNames[field]);
    }
  }

  return errors;
};

/**
 * Check if form has any validation errors
 */
export const hasValidationErrors = (
  errors: Record<string, string | null | undefined>
): boolean => {
  return Object.values(errors).some(
    (error) => error !== null && error !== undefined
  );
};

/**
 * Get first validation error message
 */
export const getFirstValidationError = (
  errors: Record<string, string | null | undefined>
): string | null => {
  for (const error of Object.values(errors)) {
    if (error) {
      return error;
    }
  }
  return null;
};
