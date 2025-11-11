import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import { configureStore } from "@reduxjs/toolkit";
import { LoginPage } from "../pages/LoginPage";
import authSlice from "../store/slices/authSlice";
import pollsSlice from "../store/slices/pollsSlice";
import type { ReactNode } from "react";

// Mock the auth API
vi.mock("../services/api", () => ({
  authAPI: {
    login: vi.fn(),
    register: vi.fn(),
    getCurrentUser: vi.fn(),
  },
}));

// Test wrapper component
interface TestWrapperProps {
  children: ReactNode;
  authState?: {
    isLoading?: boolean;
    error?: string | null;
    isAuthenticated?: boolean;
  };
}

const TestWrapper = ({ children, authState = {} }: TestWrapperProps) => {
  const store = configureStore({
    reducer: {
      auth: authSlice,
      polls: pollsSlice,
    },
    preloadedState: {
      auth: {
        user: null,
        token: null,
        isLoading: false,
        error: null,
        isAuthenticated: false,
        ...authState,
      },
      polls: {
        polls: [],
        currentPoll: null,
        pagination: null,
        isLoading: false,
        error: null,
        searchQuery: "",
        currentPage: 1,
        filters: {
          is_public: true,
          is_active: true,
        },
      },
    },
  });

  return (
    <Provider store={store}>
      <BrowserRouter>{children}</BrowserRouter>
    </Provider>
  );
};

describe("LoginPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders login form with all required fields", () => {
    render(
      <TestWrapper>
        <LoginPage />
      </TestWrapper>
    );

    expect(
      screen.getByRole("heading", { name: /welcome back/i })
    ).toBeInTheDocument();
    expect(screen.getByLabelText(/email address/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /sign in/i })
    ).toBeInTheDocument();
    expect(screen.getByText(/don't have an account/i)).toBeInTheDocument();
  });

  it("shows validation errors for empty fields", async () => {
    const user = userEvent.setup();

    render(
      <TestWrapper>
        <LoginPage />
      </TestWrapper>
    );

    const submitButton = screen.getByRole("button", { name: /sign in/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText("Email is required")).toBeInTheDocument();
      expect(screen.getByText("Password is required")).toBeInTheDocument();
    });
  });

  it("shows validation error for invalid email format", async () => {
    const user = userEvent.setup();

    render(
      <TestWrapper>
        <LoginPage />
      </TestWrapper>
    );

    const emailInput = screen.getByLabelText(/email address/i);
    const submitButton = screen.getByRole("button", { name: /sign in/i });

    await user.type(emailInput, "invalid-email");
    await user.click(submitButton);

    await waitFor(() => {
      expect(
        screen.getByText("Please enter a valid email address")
      ).toBeInTheDocument();
    });
  });

  it("shows validation error for short password", async () => {
    const user = userEvent.setup();

    render(
      <TestWrapper>
        <LoginPage />
      </TestWrapper>
    );

    const passwordInput = screen.getByLabelText(/password/i);
    const submitButton = screen.getByRole("button", { name: /sign in/i });

    await user.type(passwordInput, "123");
    await user.click(submitButton);

    await waitFor(() => {
      expect(
        screen.getByText("Password must be at least 6 characters long")
      ).toBeInTheDocument();
    });
  });

  it("toggles password visibility", async () => {
    const user = userEvent.setup();

    render(
      <TestWrapper>
        <LoginPage />
      </TestWrapper>
    );

    const passwordInput = screen.getByLabelText(/password/i);
    const toggleButton = screen.getByRole("button", {
      name: /toggle password visibility/i,
    });

    // Initially password should be hidden
    expect(passwordInput).toHaveAttribute("type", "password");

    // Click toggle to show password
    await user.click(toggleButton);
    expect(passwordInput).toHaveAttribute("type", "text");

    // Click toggle again to hide password
    await user.click(toggleButton);
    expect(passwordInput).toHaveAttribute("type", "password");
  });

  it("displays loading state during form submission", () => {
    render(
      <TestWrapper authState={{ isLoading: true }}>
        <LoginPage />
      </TestWrapper>
    );

    expect(screen.getByText("Signing In...")).toBeInTheDocument();
    expect(screen.getByRole("progressbar")).toBeInTheDocument();

    // Form fields should be disabled during loading
    expect(screen.getByLabelText(/email address/i)).toBeDisabled();
    expect(screen.getByLabelText(/password/i)).toBeDisabled();
  });

  it("displays error message from Redux state", () => {
    const errorMessage = "Invalid email or password";

    render(
      <TestWrapper authState={{ error: errorMessage }}>
        <LoginPage />
      </TestWrapper>
    );

    expect(screen.getByText(errorMessage)).toBeInTheDocument();
  });

  it("clears field errors when user starts typing", async () => {
    const user = userEvent.setup();

    render(
      <TestWrapper>
        <LoginPage />
      </TestWrapper>
    );

    const emailInput = screen.getByLabelText(/email address/i);
    const submitButton = screen.getByRole("button", { name: /sign in/i });

    // Trigger validation error
    await user.click(submitButton);
    await waitFor(() => {
      expect(screen.getByText("Email is required")).toBeInTheDocument();
    });

    // Start typing in email field
    await user.type(emailInput, "test");

    // Error should be cleared
    expect(screen.queryByText("Email is required")).not.toBeInTheDocument();
  });

  it("shows demo credentials in development mode", () => {
    // Mock development environment
    Object.defineProperty(import.meta, "env", {
      value: { DEV: true },
      configurable: true,
    });

    render(
      <TestWrapper>
        <LoginPage />
      </TestWrapper>
    );

    expect(screen.getByText("Demo Credentials:")).toBeInTheDocument();
    expect(screen.getByText("demo@example.com")).toBeInTheDocument();
    expect(screen.getByText("demo123")).toBeInTheDocument();
  });

  it("includes link to registration page", () => {
    render(
      <TestWrapper>
        <LoginPage />
      </TestWrapper>
    );

    const signUpLink = screen.getByRole("link", { name: /sign up/i });
    expect(signUpLink).toBeInTheDocument();
    expect(signUpLink).toHaveAttribute("href", "/register");
  });

  it("handles Enter key press for form submission", async () => {
    const user = userEvent.setup();

    render(
      <TestWrapper>
        <LoginPage />
      </TestWrapper>
    );

    const passwordInput = screen.getByLabelText(/password/i);

    // Type in password field and press Enter
    await user.type(passwordInput, "test123{enter}");

    // Should trigger validation (since email is empty)
    await waitFor(() => {
      expect(screen.getByText("Email is required")).toBeInTheDocument();
    });
  });
});
