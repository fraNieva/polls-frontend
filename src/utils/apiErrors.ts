/**
 * API Error handling utilities
 * Provides consistent error message extraction from API responses
 */

/**
 * Standard API error response structure
 */
export interface ApiErrorResponse {
  message: string;
  error_code?: string;
  email?: string;
  username?: string;
  timestamp?: string;
  path?: string;
  request_id?: string;
  details?: Record<string, unknown>;
}

/**
 * Axios error with API response
 */
export interface AxiosApiError {
  response?: {
    data?: ApiErrorResponse;
    status?: number;
  };
  message?: string;
  code?: string;
}

/**
 * Extract user-friendly error message from API error response
 * Handles various API error formats and provides fallback messages
 *
 * @param error - The error object from axios
 * @param defaultMessage - Fallback message if no specific error is found
 * @returns User-friendly error message
 *
 * @example
 * ```typescript
 * try {
 *   await api.register(userData);
 * } catch (error) {
 *   const errorMessage = extractApiError(error, "Registration failed");
 *   dispatch(setError(errorMessage));
 * }
 * ```
 */
export const extractApiError = (
  error: unknown,
  defaultMessage = "An error occurred"
): string => {
  const apiError = error as AxiosApiError;

  // Check for API response error message
  if (apiError.response?.data?.message) {
    return apiError.response.data.message;
  }

  // Check for network/axios error message
  if (apiError.message) {
    return apiError.message;
  }

  // Return default message
  return defaultMessage;
};

/**
 * Extract detailed error information for debugging
 *
 * @param error - The error object from axios
 * @returns Detailed error information
 */
export const extractDetailedApiError = (
  error: unknown
): {
  message: string;
  errorCode?: string;
  statusCode?: number;
  requestId?: string;
  path?: string;
  timestamp?: string;
} => {
  const apiError = error as AxiosApiError;
  const data = apiError.response?.data;

  return {
    message: extractApiError(error),
    errorCode: data?.error_code,
    statusCode: apiError.response?.status,
    requestId: data?.request_id,
    path: data?.path,
    timestamp: data?.timestamp,
  };
};

/**
 * Check if error is a specific API error code
 *
 * @param error - The error object
 * @param errorCode - The error code to check for
 * @returns True if error matches the code
 *
 * @example
 * ```typescript
 * if (isApiError(error, "DUPLICATE_RESOURCE")) {
 *   // Handle duplicate resource error
 * }
 * ```
 */
export const isApiError = (error: unknown, errorCode: string): boolean => {
  const apiError = error as AxiosApiError;
  return apiError.response?.data?.error_code === errorCode;
};

/**
 * Handle authentication-specific errors
 *
 * @param error - The error object
 * @returns User-friendly authentication error message
 */
export const extractAuthError = (error: unknown): string => {
  const apiError = error as AxiosApiError;

  // Handle specific auth error codes
  if (isApiError(error, "DUPLICATE_RESOURCE")) {
    const data = apiError.response?.data;
    if (data?.email) {
      return `The email address "${data.email}" is already registered. Please use a different email or sign in instead.`;
    }
    if (data?.username) {
      return `The username "${data.username}" is already taken. Please choose a different username.`;
    }
    return "This account already exists. Please use different credentials.";
  }

  if (isApiError(error, "VALIDATION_ERROR")) {
    return (
      apiError.response?.data?.message ||
      "Please check your input and try again."
    );
  }

  if (isApiError(error, "INVALID_CREDENTIALS")) {
    return "Invalid email or password. Please check your credentials and try again.";
  }

  if (isApiError(error, "ACCOUNT_DISABLED")) {
    return "Your account has been disabled. Please contact support for assistance.";
  }

  // Network/connection errors
  if (apiError.code === "NETWORK_ERROR" || !apiError.response) {
    return "Unable to connect to the server. Please check your internet connection and try again.";
  }

  // Server errors (5xx)
  if (apiError.response?.status && apiError.response.status >= 500) {
    return "Server error. Please try again later.";
  }

  // Use generic extraction for other errors
  return extractApiError(error, "Authentication failed");
};

/**
 * Common error codes used by the API
 */
export const API_ERROR_CODES = {
  DUPLICATE_RESOURCE: "DUPLICATE_RESOURCE",
  VALIDATION_ERROR: "VALIDATION_ERROR",
  INVALID_CREDENTIALS: "INVALID_CREDENTIALS",
  ACCOUNT_DISABLED: "ACCOUNT_DISABLED",
  RATE_LIMITED: "RATE_LIMITED",
  UNAUTHORIZED: "UNAUTHORIZED",
  FORBIDDEN: "FORBIDDEN",
  NOT_FOUND: "NOT_FOUND",
  SERVER_ERROR: "SERVER_ERROR",
} as const;
