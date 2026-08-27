import { API_BASE_URL, apiClient } from "./client";

export type User = {
  id: number;
  name: string;
  email: string;
  phone?: string;
  image?: string;
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

export type UpdateProfileInput = {
  name?: string;
  phone?: string;
};

export async function updateProfile(
  token: string,
  data: UpdateProfileInput,
): Promise<User> {
  return apiClient<User>("/auth/profile", {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });
}

export async function uploadAvatar(token: string, file: File): Promise<User> {
  const formData = new FormData();
  formData.append("avatar", file);

  const res = await fetch(`${API_BASE_URL}/auth/profile/avatar`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });

  if (!res.ok) {
    const message = await res.text();
    throw new Error(message || "Failed to upload avatar");
  }

  return res.json() as Promise<User>;
}
