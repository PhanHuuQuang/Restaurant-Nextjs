import { describe, it, expect, vi, beforeEach } from 'vitest';
import { getProducts, getFeaturedProducts, getProduct } from '../products';
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

const mockProduct = {
  id: 1,
  title: 'Margherita',
  desc: 'Classic pizza',
  img: '/img.png',
  price: 12.99,
  options: [{ id: 1, title: 'Small', additionalPrice: 0 }],
  isFeatured: true,
  categoryId: 1,
  createdAt: '2024-01-01',
  updatedAt: '2024-01-01',
};

describe('products API client', () => {
  describe('getProducts', () => {
    it('should fetch all products without params', async () => {
      mockFetch.mockReturnValue(
        jsonResponse({ data: [mockProduct], meta: { page: 1, limit: 10, total: 1, totalPages: 1 } }),
      );

      const result = await getProducts();

      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('/products'),
        expect.objectContaining({ cache: 'no-store' }),
      );
      expect(result).toEqual({
        data: [mockProduct],
        meta: { page: 1, limit: 10, total: 1, totalPages: 1 },
      });
    });

    it('should append categoryId, page and limit query params when provided', async () => {
      mockFetch.mockReturnValue(
        jsonResponse({ data: [mockProduct], meta: { page: 2, limit: 5, total: 6, totalPages: 2 } }),
      );

      const result = await getProducts({ categoryId: 1, page: 2, limit: 5 });

      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('/products?categoryId=1&page=2&limit=5'),
        expect.objectContaining({ cache: 'no-store' }),
      );
      expect(result).toEqual({
        data: [mockProduct],
        meta: { page: 2, limit: 5, total: 6, totalPages: 2 },
      });
    });
  });

  describe('getFeaturedProducts', () => {
    it('should fetch featured products', async () => {
      mockFetch.mockReturnValue(jsonResponse([mockProduct]));

      const result = await getFeaturedProducts();

      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('/products/featured'),
        expect.objectContaining({ cache: 'no-store' }),
      );
      expect(result).toEqual([mockProduct]);
    });
  });

  describe('getProduct', () => {
    it('should fetch a single product by id', async () => {
      mockFetch.mockReturnValue(jsonResponse(mockProduct));

      const result = await getProduct(1);

      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('/products/1'),
        expect.objectContaining({ cache: 'no-store' }),
      );
      expect(result).toEqual(mockProduct);
    });

    it('should throw ApiError on failure', async () => {
      mockFetch.mockReturnValue(jsonResponse('Not Found', 404));

      await expect(getProduct(999)).rejects.toThrow(ApiError);
    });
  });
});
