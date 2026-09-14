import { describe, it, expect, vi, beforeEach } from "vitest";
import { register, login, getProfile, updateProfile, uploadAvatar, logout } from "../auth";
import { ApiError } from "../client";

const mockFetch = vi.fn();
vi.stubGlobal("fetch", mockFetch);

beforeEach(() => {
  vi.clearAllMocks();
});

function jsonResponse(data: unknown, status = 200) {
  return Promise.resolve({
    ok: status >= 200 && status < 300,
    status,
    statusText: status === 200 ? "OK" : "Error",
    json: () => Promise.resolve(data),
    text: () => Promise.resolve(JSON.stringify(data)),
  });
}

const mockUser = {
  id: 1,
  name: "John",
  email: "john@test.com",
  role: "USER",
};

describe("auth API client", () => {
  describe("register", () => {
    it("should send POST request with correct body and credentials", async () => {
      mockFetch.mockReturnValue(jsonResponse(mockUser));

      const result = await register({
        name: "John",
        email: "john@test.com",
        password: "password123",
      });

      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining("/auth/register"),
        expect.objectContaining({
          method: "POST",
          cache: "no-store",
          credentials: "include",
          body: JSON.stringify({
            name: "John",
            email: "john@test.com",
            password: "password123",
          }),
        }),
      );
      expect(result).toEqual(mockUser);
    });
  });

  describe("login", () => {
    it("should send POST request with email and password", async () => {
      mockFetch.mockReturnValue(jsonResponse(mockUser));

      const result = await login({
        email: "john@test.com",
        password: "password123",
      });

      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining("/auth/login"),
        expect.objectContaining({
          method: "POST",
          body: JSON.stringify({
            email: "john@test.com",
            password: "password123",
          }),
        }),
      );
      expect(result).toEqual(mockUser);
    });

    it("should throw ApiError on 401", async () => {
      mockFetch.mockReturnValue(
        jsonResponse("Invalid credentials", 401),
      );

      await expect(
        login({ email: "john@test.com", password: "wrong" }),
      ).rejects.toThrow(ApiError);
    });
  });

  describe("getProfile", () => {
    it("should send GET request with credentials (cookie auth)", async () => {
      mockFetch.mockReturnValue(jsonResponse(mockUser));

      const result = await getProfile();

      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining("/auth/profile"),
        expect.objectContaining({
          cache: "no-store",
          credentials: "include",
        }),
      );
      expect(result).toEqual(mockUser);
    });

    it("should not attach an Authorization header", async () => {
      mockFetch.mockReturnValue(jsonResponse(mockUser));

      await getProfile();

      const options = mockFetch.mock.calls[0][1];
      expect(options.headers).toBeDefined();
      expect(options.headers.Authorization).toBeUndefined();
    });

    it("should throw ApiError on 401", async () => {
      mockFetch.mockReturnValue(jsonResponse("Unauthorized", 401));

      await expect(getProfile()).rejects.toThrow(ApiError);
    });
  });

  describe("updateProfile", () => {
    it("should send PATCH request without token argument", async () => {
      mockFetch.mockReturnValue(jsonResponse(mockUser));

      const result = await updateProfile({ name: "Johnny" });

      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining("/auth/profile"),
        expect.objectContaining({
          method: "PATCH",
          body: JSON.stringify({ name: "Johnny" }),
        }),
      );
      expect(result).toEqual(mockUser);
    });
  });

  describe("uploadAvatar", () => {
    it("should send POST request with FormData", async () => {
      mockFetch.mockReturnValue(jsonResponse(mockUser));

      const file = new File(["x"], "a.png", { type: "image/png" });
      const result = await uploadAvatar(file);

      const options = mockFetch.mock.calls[0][1];
      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining("/auth/profile/avatar"),
        expect.objectContaining({
          method: "POST",
          credentials: "include",
        }),
      );
      expect(options.body).toBeInstanceOf(FormData);
      expect(result).toEqual(mockUser);
    });
  });

  describe("logout", () => {
    it("should send POST request to /auth/logout", async () => {
      mockFetch.mockReturnValue(jsonResponse({ success: true }));

      await logout();

      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining("/auth/logout"),
        expect.objectContaining({
          method: "POST",
          credentials: "include",
        }),
      );
    });
  });
});