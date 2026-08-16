import { Category } from '@prisma/client';

export class CategoryEntity implements Category {
  id: number;
  slug: string;
  title: string;
  desc: string | null;
  img: string | null;
  color: string;
  createdAt: Date;
  updatedAt: Date;
}
