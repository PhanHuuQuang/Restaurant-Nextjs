import { describe, it, expect, vi, beforeEach } from 'vitest';
import { apiClient, ApiError, API_BASE_URL } from '../client';

const mockFetch = vi.fn();
vi.stubGlobal('fetch', mockFetch);

beforeEach(() => {
  vi.clearAllMocks();
});

function jsonResponse(data: unknown, status = 200) {
  return Promise.resolve({
    ok: status >= 200 && status < 300,
    status,
    statusText: status === 200 ? 'OK' : 'Error',
    json: () => Promise.resolve(data),
    text: () => Promise.resolve(JSON.stringify(data)),
  });
}

describe('apiClient', () => {
  it('should make a GET request with correct URL and headers', async () => {
    const data = { id: 1, title: 'Test' };
    mockFetch.mockReturnValue(jsonResponse(data));

    const result = await apiClient('/test');

    expect(mockFetch).toHaveBeenCalledWith(
      expect.stringContaining('/test'),
      expect.objectContaining({
        cache: 'no-store',
        headers: { 'Content-Type': 'application/json' },
      }),
    );
    expect(result).toEqual(data);
  });

  it('should merge custom headers', async () => {
    const data = { id: 1 };
    mockFetch.mockReturnValue(jsonResponse(data));

    await apiClient('/test', {
      headers: { Authorization: 'Bearer token' },
    });

    expect(mockFetch).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer token',
        },
      }),
    );
  });

  it('should merge custom options', async () => {
    const data = { id: 1 };
    mockFetch.mockReturnValue(jsonResponse(data));

    await apiClient('/test', { method: 'POST', body: JSON.stringify({ a: 1 }) });

    expect(mockFetch).toHaveBeenCalledWith(
      expect.stringContaining('/test'),
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify({ a: 1 }),
        cache: 'no-store',
      }),
    );
  });

  it('should throw ApiError on non-ok response', async () => {
    mockFetch.mockReturnValue(jsonResponse('Server Error', 500));

    await expect(apiClient('/test')).rejects.toThrow(ApiError);
  });

  it('should throw ApiError with status code', async () => {
    mockFetch.mockReturnValue(jsonResponse('Unauthorized', 401));

    try {
      await apiClient('/test');
    } catch (err) {
      expect(err).toBeInstanceOf(ApiError);
      expect((err as ApiError).status).toBe(401);
    }
  });

  it('should use statusText as fallback message when body is empty', async () => {
    mockFetch.mockReturnValue(
      Promise.resolve({
        ok: false,
        status: 404,
        statusText: 'Not Found',
        json: () => Promise.resolve(null),
        text: () => Promise.resolve(''),
      }),
    );

    try {
      await apiClient('/test');
    } catch (err) {
      expect((err as ApiError).message).toBe('Not Found');
    }
  });
});

describe('ApiError', () => {
  it('should have correct name, status, and message', () => {
    const err = new ApiError(404, 'Not found');
    expect(err.name).toBe('ApiError');
    expect(err.status).toBe(404);
    expect(err.message).toBe('Not found');
    expect(err).toBeInstanceOf(Error);
  });
});

describe('API_BASE_URL', () => {
  it('should default to localhost:3000 when env var is not set', () => {
    delete process.env.NEXT_PUBLIC_API_BASE_URL;
    expect(API_BASE_URL).toBe('http://localhost:3000');
  });
});
