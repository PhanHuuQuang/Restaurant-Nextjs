import { apiClient, ApiError } from "./client";

export type User = {
  id: number;
  name: string;
  email: string;
  role: string;
};

export type AuthResponse = {
  accessToken: string;
};

export type RegisterInput = {
  name: string;
  email: string;
  password: string;
  phone?: string;
};

export type LoginInput = {
  email: string;
  password: string;
};

export async function register(data: RegisterInput): Promise<AuthResponse> {
  return apiClient<AuthResponse>("/auth/register", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function login(data: LoginInput): Promise<AuthResponse> {
  return apiClient<AuthResponse>("/auth/login", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function getProfile(token: string): Promise<User> {
  return apiClient<User>("/auth/profile", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

export async function refreshToken(token: string): Promise<AuthResponse> {
  return apiClient<AuthResponse>("/auth/refresh", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

export function getGoogleAuthUrl(): string {
  const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID ?? "";
  const redirectUri = `${window.location.origin}/auth/callback`;
  const scope = "email profile";
  return `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=code&scope=${encodeURIComponent(scope)}`;
}
