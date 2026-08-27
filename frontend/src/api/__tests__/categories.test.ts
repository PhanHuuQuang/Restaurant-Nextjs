import { describe, it, expect, vi, beforeEach } from 'vitest';
import { getCategories, getCategory } from '../categories';
import { ApiError } from '../client';

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

const mockCategory = {
  id: 1,
  slug: 'pizzas',
  title: 'Cheesy Pizzas',
  description: 'Pizza Paradise',
  image: '/img.png',
  color: 'white',
  createdAt: '2024-01-01',
  updatedAt: '2024-01-01',
};

describe('categories API client', () => {
  describe('getCategories', () => {
    it('should fetch all categories', async () => {
      mockFetch.mockReturnValue(jsonResponse([mockCategory]));

      const result = await getCategories();

      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('/categories'),
        expect.objectContaining({ cache: 'no-store' }),
      );
      expect(result).toEqual([mockCategory]);
    });
  });

  describe('getCategory', () => {
    it('should fetch a single category with products by slug', async () => {
      const categoryWithProducts = {
        ...mockCategory,
        products: [{ id: 1, title: 'Margherita', price: 12.99 }],
      };
      mockFetch.mockReturnValue(jsonResponse(categoryWithProducts));

      const result = await getCategory('pizzas');

      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('/categories/pizzas'),
        expect.objectContaining({ cache: 'no-store' }),
      );
      expect(result).toEqual(categoryWithProducts);
    });

    it('should throw ApiError on failure', async () => {
      mockFetch.mockReturnValue(jsonResponse('Not Found', 404));

      await expect(getCategory('nonexistent')).rejects.toThrow(ApiError);
    });
  });
});
