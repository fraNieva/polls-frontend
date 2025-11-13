import axios from "axios";
import { API_URL, isDevelopment, DEBUG_API } from "../config/environment";

// API Configuration - now uses environment variables
const API_BASE_URL = API_URL;

// Create axios instance
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Debug logging in development
if (isDevelopment && DEBUG_API) {
  console.log("🌐 API Base URL configured:", API_BASE_URL);
}

// Request interceptor to add auth token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("access_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Debug logging for API requests
    if (isDevelopment && DEBUG_API) {
      console.log(
        `🔗 API Request: ${config.method?.toUpperCase()} ${config.url}`,
        config.data
      );
    }

    return config;
  },
  (error) => {
    if (isDevelopment && DEBUG_API) {
      console.error("🚨 API Request Error:", error);
    }
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => {
    // Debug logging for API responses
    if (isDevelopment && DEBUG_API) {
      console.log(
        `✅ API Response: ${response.config.method?.toUpperCase()} ${
          response.config.url
        }`,
        response.data
      );
    }
    return response;
  },
  (error) => {
    if (isDevelopment && DEBUG_API) {
      console.error(
        "🚨 API Response Error:",
        error.response?.data || error.message
      );
    }

    // Only redirect on 401 for authenticated endpoints (not login/register)
    if (error.response?.status === 401) {
      const requestUrl = error.config?.url || "";

      // Don't redirect if the 401 is from login or register endpoints
      if (
        !requestUrl.includes("/auth/login") &&
        !requestUrl.includes("/auth/register")
      ) {
        // Token expired or invalid during an authenticated request
        localStorage.removeItem("access_token");
        globalThis.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  async login(email: string, password: string) {
    const response = await apiClient.post("/auth/login", { email, password });
    return response.data;
  },

  async register(userData: {
    username: string;
    email: string;
    password: string;
    full_name: string;
  }) {
    const response = await apiClient.post("/auth/register", {
      ...userData,
      is_active: true,
    });
    return response.data;
  },

  async getCurrentUser() {
    const response = await apiClient.get("/users/me");
    return response.data;
  },

  async updateProfile(
    updates: Partial<{
      username: string;
      email: string;
      full_name: string;
    }>
  ) {
    const response = await apiClient.put("/users/me", updates);
    return response.data;
  },
};

// Polls API
export const pollsAPI = {
  async getPolls(
    page = 1,
    size = 10,
    filters: {
      search?: string;
      is_public?: boolean;
      is_active?: boolean;
      owner_id?: number;
    } = {}
  ) {
    const params = new URLSearchParams({
      page: page.toString(),
      size: size.toString(),
    });

    // Add filters to params
    for (const [key, value] of Object.entries(filters)) {
      if (value !== undefined) {
        params.append(key, value.toString());
      }
    }

    const response = await apiClient.get(`/polls/?${params}`);
    return {
      polls: response.data.polls,
      pagination: {
        total: response.data.total,
        page: response.data.page,
        size: response.data.size,
        pages: response.data.pages,
        has_next: response.data.has_next,
        has_prev: response.data.has_prev,
      },
    };
  },

  // Convenience method for public polls (for backward compatibility)
  async getPublicPolls(page = 1, size = 10, search?: string) {
    return this.getPolls(page, size, {
      search,
      is_public: true,
      is_active: true,
    });
  },

  // Convenience method for user's polls
  async getUserPolls(page = 1, size = 10, search?: string) {
    return this.getPolls(page, size, {
      search,
      // No is_public filter - will return user's public and private polls
    });
  },

  async getPollDetails(pollId: number) {
    const response = await apiClient.get(`/polls/${pollId}`);
    return response.data;
  },

  async createPoll(pollData: {
    title: string;
    description?: string;
    is_active?: boolean;
    is_public?: boolean;
  }) {
    const response = await apiClient.post("/polls/", pollData);
    return response.data;
  },

  async addPollOption(pollId: number, optionText: string) {
    const response = await apiClient.post(`/polls/${pollId}/options`, {
      text: optionText,
    });
    return response.data;
  },

  async voteOnPoll(pollId: number, optionId: number) {
    const response = await apiClient.post(`/polls/${pollId}/vote/${optionId}`);
    return response.data;
  },

  async updatePoll(
    pollId: number,
    updates: {
      title?: string;
      description?: string;
      is_active?: boolean;
      is_public?: boolean;
    }
  ) {
    const response = await apiClient.put(`/polls/${pollId}`, updates);
    return response.data;
  },

  async deletePoll(pollId: number) {
    const response = await apiClient.delete(`/polls/${pollId}`);
    return response.data;
  },
};

export default apiClient;
