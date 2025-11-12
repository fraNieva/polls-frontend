/**
 * Environment configuration module
 * Centralizes all environment variable access and provides type safety
 */

interface EnvironmentConfig {
  API_URL: string;
  APP_ENV: "development" | "production" | "test";
  ENABLE_ANALYTICS: boolean;
  LOG_LEVEL: "debug" | "info" | "warn" | "error";
  ENABLE_SERVICE_WORKER: boolean;
  ENABLE_CACHING: boolean;
  ENABLE_CSP: boolean;
  DEBUG_API: boolean;
  DEBUG_REDUX: boolean;
}

/**
 * Parse boolean environment variables
 */
const parseBoolean = (
  value: string | undefined,
  defaultValue: boolean = false
): boolean => {
  if (!value) return defaultValue;
  return value.toLowerCase() === "true";
};

/**
 * Parse environment variable with fallback
 */
const parseString = (
  value: string | undefined,
  defaultValue: string
): string => {
  return value || defaultValue;
};

/**
 * Validate and parse environment variables
 */
const createConfig = (): EnvironmentConfig => {
  const config: EnvironmentConfig = {
    API_URL: parseString(
      import.meta.env.VITE_API_URL,
      "http://localhost:8000/api/v1"
    ),
    APP_ENV: parseString(
      import.meta.env.VITE_APP_ENV,
      "development"
    ) as EnvironmentConfig["APP_ENV"],
    ENABLE_ANALYTICS: parseBoolean(
      import.meta.env.VITE_ENABLE_ANALYTICS,
      false
    ),
    LOG_LEVEL: parseString(
      import.meta.env.VITE_LOG_LEVEL,
      "info"
    ) as EnvironmentConfig["LOG_LEVEL"],
    ENABLE_SERVICE_WORKER: parseBoolean(
      import.meta.env.VITE_ENABLE_SERVICE_WORKER,
      false
    ),
    ENABLE_CACHING: parseBoolean(import.meta.env.VITE_ENABLE_CACHING, false),
    ENABLE_CSP: parseBoolean(import.meta.env.VITE_ENABLE_CSP, false),
    DEBUG_API: parseBoolean(import.meta.env.VITE_DEBUG_API, false),
    DEBUG_REDUX: parseBoolean(import.meta.env.VITE_DEBUG_REDUX, false),
  };

  // Validate critical configuration
  if (!config.API_URL) {
    throw new Error("VITE_API_URL is required but not provided");
  }

  if (!["development", "production", "test"].includes(config.APP_ENV)) {
    console.warn(
      `Invalid APP_ENV: ${config.APP_ENV}, falling back to 'development'`
    );
    config.APP_ENV = "development";
  }

  return config;
};

// Export singleton config
export const config = createConfig();

// Export individual values for convenience
export const {
  API_URL,
  APP_ENV,
  ENABLE_ANALYTICS,
  LOG_LEVEL,
  ENABLE_SERVICE_WORKER,
  ENABLE_CACHING,
  ENABLE_CSP,
  DEBUG_API,
  DEBUG_REDUX,
} = config;

// Helper functions
export const isDevelopment = APP_ENV === "development";
export const isProduction = APP_ENV === "production";
export const isTest = APP_ENV === "test";

// Debug logging for development
if (isDevelopment && DEBUG_API) {
  console.log("🔧 Environment Configuration:", config);
}
