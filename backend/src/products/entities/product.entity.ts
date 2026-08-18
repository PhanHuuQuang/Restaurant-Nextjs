import { Product } from '../../../prisma/generated/prisma/client';
import { ProductOption } from '../../../prisma/generated/prisma/client';
import { Decimal } from '../../../prisma/generated/prisma/internal/prismaNamespace';

export class ProductEntity implements Product {
  id: number;
  title: string;
  desc: string | null;
  img: string | null;
  price: Decimal;
  isFeatured: boolean;
  categoryId: number;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
  options: ProductOption[];
}
