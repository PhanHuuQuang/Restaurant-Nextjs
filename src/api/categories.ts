import { apiClient } from "./client";
import { Category, CategoryWithProducts } from "./types";

export function getCategories() {
  return apiClient<Category[]>("/categories");
}

export function getCategory(slug: string) {
  return apiClient<CategoryWithProducts>(`/categories/${slug}`);
}
