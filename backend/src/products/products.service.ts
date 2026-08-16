import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Injectable()
export class ProductsService {
  constructor(private readonly prisma: PrismaService) {}

  create(createProductDto: CreateProductDto) {
    const data: Prisma.ProductUncheckedCreateInput = {
      ...createProductDto,
      options: createProductDto.options as unknown as Prisma.InputJsonValue,
    };

    return this.prisma.product.create({ data });
  }

  findAll(categoryId?: number) {
    return this.prisma.product.findMany({
      where: categoryId ? { categoryId } : undefined,
      orderBy: { createdAt: 'asc' },
    });
  }

  findFeatured() {
    return this.prisma.product.findMany({
      where: { isFeatured: true },
      orderBy: { createdAt: 'asc' },
    });
  }

  async findOne(id: number) {
    const product = await this.prisma.product.findUnique({
      where: { id },
      include: { category: true },
    });

    if (!product) {
      throw new NotFoundException(`Product with id ${id} not found`);
    }

    return product;
  }

  update(id: number, updateProductDto: UpdateProductDto) {
    const data: Prisma.ProductUncheckedUpdateInput = {
      ...updateProductDto,
      options: updateProductDto.options as unknown as Prisma.InputJsonValue,
    };

    return this.prisma.product.update({
      where: { id },
      data,
    });
  }

  remove(id: number) {
    return this.prisma.product.delete({ where: { id } });
  }
}
