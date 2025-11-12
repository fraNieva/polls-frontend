/**
 * Authentication validation utilities
 * Provides reusable validation functions for auth forms
 */

import type { FormErrors } from "./authUtils";

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
 * Username validation rules
 */
export const USERNAME_RULES = {
  minLength: 3,
  maxLength: 30,
  pattern: /^\w+$/,
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
  username: {
    required: true,
    minLength: USERNAME_RULES.minLength,
    maxLength: USERNAME_RULES.maxLength,
    pattern: USERNAME_RULES.pattern,
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
 * Validate username
 */
export const validateUsername = (username: string): string | null => {
  if (!username) {
    return "Username is required";
  }

  if (username.length < USERNAME_RULES.minLength) {
    return `Username must be at least ${USERNAME_RULES.minLength} characters long`;
  }

  if (username.length > USERNAME_RULES.maxLength) {
    return `Username must be no more than ${USERNAME_RULES.maxLength} characters long`;
  }

  if (!USERNAME_RULES.pattern.test(username)) {
    return "Username can only contain letters, numbers, and underscores";
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
 * Validate login form
 */
export const validateLoginForm = (data: {
  email: string;
  password: string;
}): FormErrors<{ email: string; password: string }> => {
  const errors: FormErrors<{ email: string; password: string }> = {};

  const emailError = validateEmail(data.email);
  if (emailError) {
    errors.email = emailError;
  }

  const passwordError = validatePassword(data.password);
  if (passwordError) {
    errors.password = passwordError;
  }

  return errors;
};

/**
 * Validate register form
 */
export const validateRegisterForm = (data: {
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}): FormErrors<{
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}> => {
  const errors: FormErrors<{
    firstName: string;
    lastName: string;
    username: string;
    email: string;
    password: string;
    confirmPassword: string;
  }> = {};

  const firstNameError = validateName(data.firstName, "First name");
  if (firstNameError) {
    errors.firstName = firstNameError;
  }

  const lastNameError = validateName(data.lastName, "Last name");
  if (lastNameError) {
    errors.lastName = lastNameError;
  }

  const usernameError = validateUsername(data.username);
  if (usernameError) {
    errors.username = usernameError;
  }

  const emailError = validateEmail(data.email);
  if (emailError) {
    errors.email = emailError;
  }

  const passwordError = validatePassword(data.password);
  if (passwordError) {
    errors.password = passwordError;
  }

  const confirmPasswordError = validatePasswordConfirmation(
    data.password,
    data.confirmPassword
  );
  if (confirmPasswordError) {
    errors.confirmPassword = confirmPasswordError;
  }

  return errors;
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
