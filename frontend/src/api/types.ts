export type ProductOption = {
  id: number;
  title: string;
  additionalPrice: number;
};

export type Product = {
  id: number;
  title: string;
  desc: string | null;
  img: string | null;
  price: number;
  options: ProductOption[];
  isFeatured: boolean;
  categoryId: number;
  createdAt: string;
  updatedAt: string;
};

export type Category = {
  id: number;
  slug: string;
  title: string;
  description: string | null;
  image: string | null;
  color: string;
  createdAt: string;
  updatedAt: string;
};

export type CategoryWithProducts = Category & {
  products: Product[];
};
