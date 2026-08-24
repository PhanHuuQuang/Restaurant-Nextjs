import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Injectable()
export class CategoriesService {
  constructor(private readonly prisma: PrismaService) {}

  create(createCategoryDto: CreateCategoryDto) {
    return this.prisma.category.create({ data: createCategoryDto });
  }

  findAll() {
    return this.prisma.category.findMany({
      where: { deletedAt: null },
      orderBy: { createdAt: 'asc' },
    });
  }

  async findOne(slug: string) {
    const category = await this.prisma.category.findFirst({
      where: { slug, deletedAt: null },
      include: { products: { where: { deletedAt: null } } },
    });

    if (!category) {
      throw new NotFoundException(`Category with slug "${slug}" not found`);
    }

    return category;
  }

  update(slug: string, updateCategoryDto: UpdateCategoryDto) {
    return this.prisma.category.update({
      where: { slug },
      data: updateCategoryDto,
    });
  }

  async remove(slug: string) {
    await this.findOne(slug);
    return this.prisma.category.update({
      where: { slug },
      data: { deletedAt: new Date() },
    });
  }
}
