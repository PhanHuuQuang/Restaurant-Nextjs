import { Category } from '../../../prisma/generated/prisma/client';

export class CategoryEntity implements Category {
  id: number;
  slug: string;
  title: string;
  description: string | null;
  image: string | null;
  color: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
}
