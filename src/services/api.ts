import axios from "axios";

// API Configuration
const API_BASE_URL = "http://localhost:8000/api/v1";

// Create axios instance
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor to add auth token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("access_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem("access_token");
      window.location.href = "/login";
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
    filters: Record<string, string | number | boolean> = {}
  ) {
    const params = new URLSearchParams({
      page: page.toString(),
      size: size.toString(),
      ...Object.fromEntries(
        Object.entries(filters).filter(([, value]) => value !== undefined)
      ),
    });

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
