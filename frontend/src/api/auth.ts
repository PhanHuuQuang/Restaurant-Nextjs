import { apiClient } from "./client";

export type User = {
  id: number;
  name: string;
  email: string;
  phone?: string;
  image?: string;
  role: string;
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

export async function register(data: RegisterInput): Promise<User> {
  return apiClient<User>("/auth/register", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function login(data: LoginInput): Promise<User> {
  return apiClient<User>("/auth/login", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function getProfile(): Promise<User> {
  return apiClient<User>("/auth/profile");
}

export type UpdateProfileInput = {
  name?: string;
  phone?: string;
};

export async function updateProfile(data: UpdateProfileInput): Promise<User> {
  return apiClient<User>("/auth/profile", {
    method: "PATCH",
    body: JSON.stringify(data),
  });
}

export async function uploadAvatar(file: File): Promise<User> {
  const formData = new FormData();
  formData.append("avatar", file);
  return apiClient<User>("/auth/profile/avatar", {
    method: "POST",
    body: formData,
  });
}

export async function logout(): Promise<void> {
  await apiClient<{ success: boolean }>("/auth/logout", {
    method: "POST",
  });
}