// User-related TypeScript type definitions

export interface User {
  id: number;
  username: string;
  email: string;
  full_name: string;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  access_token: string;
  token_type: string;
  user: User;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
  full_name: string;
}

export interface RegisterResponse {
  id: number;
  username: string;
  email: string;
  full_name: string;
  is_active: boolean;
  message: string;
}

export interface AuthError {
  message: string;
  error_code?: string;
  details?: Record<string, unknown>;
}

export interface UpdateProfileRequest {
  username?: string;
  email?: string;
  full_name?: string;
}

export interface PasswordChangeRequest {
  current_password: string;
  new_password: string;
  confirm_password: string;
}

export interface PasswordResetRequest {
  email: string;
}

export interface PasswordResetConfirmRequest {
  token: string;
  new_password: string;
  confirm_password: string;
}
