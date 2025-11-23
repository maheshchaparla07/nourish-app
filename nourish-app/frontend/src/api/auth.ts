export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: {
    id: string;
    email: string;
    name?: string;
    [key: string]: unknown;
  };
}

export interface RegisterResponse {
  token: string;
  user: {
    id: string;
    email: string;
    name?: string;
    [key: string]: unknown;
  };
}

export interface ErrorResponse {
  message: string;
}

export interface User {
  id: string;
  email: string;
  name?: string;
  created_at?: string;
}

export interface UsersListResponse {
  users: User[];
  total: number;
}

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

export async function loginUser(
  credentials: LoginRequest
): Promise<LoginResponse> {
  const response = await fetch(`${API_BASE_URL}/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(credentials),
  });

  const data = await response.json();

  if (!response.ok) {
    const error = data as ErrorResponse;
    throw new Error(error.message || 'Login failed. Please try again.');
  }

  return data as LoginResponse;
}

export async function registerUser(
  credentials: RegisterRequest
): Promise<RegisterResponse> {
  const response = await fetch(`${API_BASE_URL}/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(credentials),
  });

  const data = await response.json();

  if (!response.ok) {
    const error = data as ErrorResponse;
    throw new Error(error.message || 'Registration failed. Please try again.');
  }

  return data as RegisterResponse;
}

export async function getAllUsers(): Promise<UsersListResponse> {
  const token = localStorage.getItem('auth_token');
  
  const response = await fetch(`${API_BASE_URL}/users`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    const error = data as ErrorResponse;
    throw new Error(error.message || 'Failed to fetch users.');
  }

  return data as UsersListResponse;
}

