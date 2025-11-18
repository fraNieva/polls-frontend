/**
 * Poll validation utilities matching backend requirements
 */

export interface PollFormData {
  title: string;
  description: string;
  options: string[];
  isPublic: boolean;
  isActive: boolean;
}

export interface PollFormErrors {
  title?: string;
  description?: string;
  options?: string;
}

/**
 * Validate poll title
 * - Must be 5-200 characters
 * - Cannot be empty or whitespace only
 * - Must contain at least one letter
 */
export const validateTitle = (title: string): string | undefined => {
  const trimmed = title.trim();

  if (!trimmed) {
    return "Title is required";
  }

  if (trimmed.length < 5) {
    return "Title must be at least 5 characters";
  }

  if (trimmed.length > 200) {
    return "Title cannot exceed 200 characters";
  }

  // Must contain at least one letter
  if (!/[a-zA-Z]/.test(trimmed)) {
    return "Title must contain at least one letter";
  }

  return undefined;
};

/**
 * Validate poll description
 * - Optional field
 * - Max 500 characters
 */
export const validateDescription = (
  description: string
): string | undefined => {
  if (!description) {
    return undefined; // Optional field
  }

  if (description.length > 500) {
    return "Description cannot exceed 500 characters";
  }

  return undefined;
};

/**
 * Validate poll options
 * - Must have 2-10 options if any options provided
 * - Each option 1-100 characters
 * - No duplicate options (case-insensitive)
 */
export const validateOptions = (options: string[]): string | undefined => {
  // Empty options array is valid (can add later)
  if (options.length === 0) {
    return undefined;
  }

  if (options.length < 2) {
    return "Must have at least 2 options";
  }

  if (options.length > 10) {
    return "Cannot exceed 10 options";
  }

  // Check individual option length
  for (const option of options) {
    const trimmed = option.trim();
    if (trimmed.length < 1) {
      return "Options cannot be empty";
    }
    if (trimmed.length > 100) {
      return "Each option must be 100 characters or less";
    }
  }

  // Check for duplicates (case-insensitive)
  const lowerCaseOptions = options.map((opt) => opt.toLowerCase());
  const uniqueOptions = new Set(lowerCaseOptions);
  if (uniqueOptions.size !== options.length) {
    return "Options must be unique";
  }

  return undefined;
};

/**
 * Validate entire poll form
 * Returns errors object with field-specific errors
 */
export const validatePollForm = (formData: PollFormData): PollFormErrors => {
  const errors: PollFormErrors = {};

  const titleError = validateTitle(formData.title);
  if (titleError) {
    errors.title = titleError;
  }

  const descriptionError = validateDescription(formData.description);
  if (descriptionError) {
    errors.description = descriptionError;
  }

  const optionsError = validateOptions(formData.options);
  if (optionsError) {
    errors.options = optionsError;
  }

  return errors;
};

/**
 * Check if form has any errors
 */
export const hasFormErrors = (errors: PollFormErrors): boolean => {
  return Object.keys(errors).length > 0;
};
