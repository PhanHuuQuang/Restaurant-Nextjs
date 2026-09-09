import { apiClient } from "./client";
import { Product } from "./types";

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface PaginatedProducts {
  data: Product[];
  meta: PaginationMeta;
}

export function getProducts(params?: {
  categoryId?: number;
  page?: number;
  limit?: number;
}) {
  const searchParams = new URLSearchParams();
  if (params?.categoryId) searchParams.set("categoryId", String(params.categoryId));
  if (params?.page) searchParams.set("page", String(params.page));
  if (params?.limit) searchParams.set("limit", String(params.limit));
  const query = searchParams.toString();

  return apiClient<PaginatedProducts>(`/products${query ? `?${query}` : ""}`);
}

export function getFeaturedProducts() {
  return apiClient<Product[]>("/products/featured");
}

export function getProduct(id: number) {
  return apiClient<Product>(`/products/${id}`);
}
