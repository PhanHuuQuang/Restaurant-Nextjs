import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import Loading, {
  FeaturedSkeleton,
  MenuPageSkeleton,
  CategoryGridSkeleton,
  ProductPageSkeleton,
} from "../Skeleton";

describe("Loading", () => {
  it("renders a generic skeleton block", () => {
    const { container } = render(<Loading />);
    expect(container.querySelector(".animate-pulse")).toBeTruthy();
  });
});

describe("FeaturedSkeleton", () => {
  it("renders three skeleton cards", () => {
    const { container } = render(<FeaturedSkeleton />);
    expect(container.querySelectorAll("[class*='w-screen h-[60vh]']").length).toBe(3);
  });

  it("renders an error banner when error prop is provided", () => {
    render(<FeaturedSkeleton error="Something went wrong" />);
    expect(screen.getByText("Something went wrong")).toBeDefined();
  });
});

describe("MenuPageSkeleton", () => {
  it("renders three category skeletons", () => {
    const { container } = render(<MenuPageSkeleton />);
    expect(container.querySelectorAll("[class*='h-1/3 bg-gray-200']").length).toBe(3);
  });

  it("renders an error banner when error prop is provided", () => {
    render(<MenuPageSkeleton error="Menu failed" />);
    expect(screen.getByText("Menu failed")).toBeDefined();
  });
});

describe("CategoryGridSkeleton", () => {
  it("renders six product card skeletons", () => {
    const { container } = render(<CategoryGridSkeleton />);
    expect(container.querySelectorAll("[class*='h-[60vh] border-r-2']").length).toBe(6);
  });

  it("renders an error banner when error prop is provided", () => {
    render(<CategoryGridSkeleton error="No products found" />);
    expect(screen.getByText("No products found")).toBeDefined();
  });
});

describe("ProductPageSkeleton", () => {
  it("renders the product layout skeleton", () => {
    const { container } = render(<ProductPageSkeleton />);
    expect(container.querySelector("[class*='bg-gray-200 rounded-md']")).toBeTruthy();
  });

  it("renders an error banner when error prop is provided", () => {
    render(<ProductPageSkeleton error="Product unavailable" />);
    expect(screen.getByText("Product unavailable")).toBeDefined();
  });
});