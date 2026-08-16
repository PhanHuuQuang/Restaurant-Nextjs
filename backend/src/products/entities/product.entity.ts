import { Product, Prisma } from '@prisma/client';

export class ProductEntity implements Product {
  id: number;
  title: string;
  desc: string | null;
  img: string | null;
  price: number;
  options: Prisma.JsonValue;
  isFeatured: boolean;
  categoryId: number;
  createdAt: Date;
  updatedAt: Date;
}
