import { apiClient } from "./client";
import { Product } from "./types";

export function getProducts(categoryId?: number) {
  const query = categoryId ? `?categoryId=${categoryId}` : "";
  return apiClient<Product[]>(`/products${query}`);
}

export function getFeaturedProducts() {
  return apiClient<Product[]>("/products/featured");
}

export function getProduct(id: number) {
  return apiClient<Product>(`/products/${id}`);
}
