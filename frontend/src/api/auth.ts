export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
}

export interface MicrosoftAuthCallbackRequest {
  code: string;
  state: string;
}

export interface ProfileCompletionRequest {
  full_name: string;
  role: string;
  department: string;
}

export interface LoginResponse {
  token: string;
  user: {
    id: string;
    email: string;
    name?: string;
    full_name?: string;
    role?: string;
    department?: string;
    auth_provider?: string;
    profile_completed?: boolean;
    [key: string]: unknown;
  };
  profile_completed?: boolean;
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

export interface MicrosoftLoginResponse {
  authorization_url: string;
}

export interface ProfileCompletionResponse {
  token: string;
  user: {
    id: string;
    email: string;
    full_name?: string;
    role?: string;
    department?: string;
    [key: string]: unknown;
  };
  message: string;
}

export interface ErrorResponse {
  message: string;
}

export interface User {
  id: string;
  email: string;
  name?: string;
  full_name?: string;
  role?: string;
  department?: string;
  auth_provider?: string;
  profile_completed?: boolean;
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

export async function getMicrosoftLoginUrl(): Promise<MicrosoftLoginResponse> {
  const response = await fetch(`${API_BASE_URL}/microsoft/login`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  const data = await response.json();

  if (!response.ok) {
    const error = data as ErrorResponse;
    throw new Error(error.message || 'Failed to initiate Microsoft login');
  }

  return data as MicrosoftLoginResponse;
}

export async function handleMicrosoftCallback(
  code: string,
  state: string
): Promise<LoginResponse> {
  const response = await fetch(`${API_BASE_URL}/microsoft/callback`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ code, state }),
  });

  const data = await response.json();

  if (!response.ok) {
    const error = data as ErrorResponse;
    throw new Error(error.message || 'Microsoft login failed. Please try again.');
  }

  return data as LoginResponse;
}

export async function completeProfile(
  profileData: ProfileCompletionRequest,
  token: string
): Promise<ProfileCompletionResponse> {
  const response = await fetch(`${API_BASE_URL}/profile`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(profileData),
  });

  const data = await response.json();

  if (!response.ok) {
    const error = data as ErrorResponse;
    throw new Error(error.message || 'Failed to complete profile. Please try again.');
  }

  return data as ProfileCompletionResponse;
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
    throw new Error(error.message || 'Failed to fetch users');
  }

  return data as UsersListResponse;
}

  });

  const data = await response.json();

  if (!response.ok) {
    const error = data as ErrorResponse;
    throw new Error(error.message || 'Failed to fetch users.');
  }

  return data as UsersListResponse;
}

