import { describe, it, expect, vi, beforeEach } from "vitest";
import { register, login, getProfile, refreshToken } from "../auth";
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

describe("auth API client", () => {
  describe("register", () => {
    it("should send POST request with correct body", async () => {
      const responseData = { accessToken: "jwt-token" };
      mockFetch.mockReturnValue(jsonResponse(responseData));

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
          body: JSON.stringify({
            name: "John",
            email: "john@test.com",
            password: "password123",
          }),
        }),
      );
      expect(result).toEqual({ accessToken: "jwt-token" });
    });
  });

  describe("login", () => {
    it("should send POST request with email and password", async () => {
      const responseData = { accessToken: "login-token" };
      mockFetch.mockReturnValue(jsonResponse(responseData));

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
      expect(result).toEqual({ accessToken: "login-token" });
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
    it("should send GET request with Authorization header", async () => {
      const user = { id: 1, name: "John", email: "john@test.com", role: "USER" };
      mockFetch.mockReturnValue(jsonResponse(user));

      const result = await getProfile("my-token");

      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining("/auth/profile"),
        expect.objectContaining({
          cache: "no-store",
          headers: expect.objectContaining({
            Authorization: "Bearer my-token",
          }),
        }),
      );
      expect(result).toEqual(user);
    });

    it("should throw ApiError on 401", async () => {
      mockFetch.mockReturnValue(jsonResponse("Unauthorized", 401));

      await expect(getProfile("bad-token")).rejects.toThrow(ApiError);
    });
  });

  describe("refreshToken", () => {
    it("should send POST request with Authorization header", async () => {
      const responseData = { accessToken: "new-token" };
      mockFetch.mockReturnValue(jsonResponse(responseData));

      const result = await refreshToken("refresh-token");

      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining("/auth/refresh"),
        expect.objectContaining({
          method: "POST",
          headers: expect.objectContaining({
            Authorization: "Bearer refresh-token",
          }),
        }),
      );
      expect(result).toEqual({ accessToken: "new-token" });
    });
  });
});
