import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { useApi } from '../useApi';

describe('useApi', () => {
  it('should start with loading true and null data', () => {
    const fn = vi.fn().mockResolvedValue('result');
    const { result } = renderHook(() => useApi(fn));

    expect(result.current.loading).toBe(true);
    expect(result.current.data).toBeNull();
    expect(result.current.error).toBeNull();
  });

  it('should return data on success', async () => {
    const fn = vi.fn().mockResolvedValue({ id: 1, title: 'Test' });
    const { result } = renderHook(() => useApi(fn));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.data).toEqual({ id: 1, title: 'Test' });
    expect(result.current.error).toBeNull();
  });

  it('should return error on failure', async () => {
    const error = new Error('Fetch failed');
    const fn = vi.fn().mockRejectedValue(error);
    const { result } = renderHook(() => useApi(fn));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.error).toBe(error);
    expect(result.current.data).toBeNull();
  });

  it('should call the provided function', async () => {
    const fn = vi.fn().mockResolvedValue('data');
    renderHook(() => useApi(fn));

    await waitFor(() => {
      expect(fn).toHaveBeenCalledTimes(1);
    });
  });
});
