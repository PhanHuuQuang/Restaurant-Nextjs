export type ProductOption = {
  title: string;
  additionalPrice: number;
};

export type Product = {
  id: number;
  title: string;
  desc: string | null;
  img: string | null;
  price: number;
  options: ProductOption[] | null;
  isFeatured: boolean;
  categoryId: number;
  createdAt: string;
  updatedAt: string;
};

export type Category = {
  id: number;
  slug: string;
  title: string;
  desc: string | null;
  img: string | null;
  color: string;
  createdAt: string;
  updatedAt: string;
};

export type CategoryWithProducts = Category & {
  products: Product[];
};
