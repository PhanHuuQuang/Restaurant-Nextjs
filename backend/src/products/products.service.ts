import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { FindProductsQueryDto } from './dto/find-products-query.dto';

@Injectable()
export class ProductsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createProductDto: CreateProductDto) {
    const { options, ...productData } = createProductDto;

    return this.prisma.product.create({
      data: {
        ...productData,
        options: options
          ? {
              create: options.map((o) => ({
                title: o.title,
                additionalPrice: o.additionalPrice,
              })),
            }
          : undefined,
      },
      include: { options: true },
    });
  }

  async findAll(query: FindProductsQueryDto) {
    const { page, limit, categoryId } = query;
    const skip = (page - 1) * limit;
    const where = {
      deletedAt: null,
      ...(categoryId ? { categoryId } : {}),
    };

    const [data, total] = await this.prisma.$transaction([
      this.prisma.product.findMany({
        skip,
        take: limit,
        where,
        include: { options: true },
        orderBy: { createdAt: 'asc' },
      }),
      this.prisma.product.count({ where }),
    ]);

    return {
      data,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  findFeatured() {
    return this.prisma.product.findMany({
      where: { isFeatured: true, deletedAt: null },
      include: { options: true },
      orderBy: { createdAt: 'asc' },
    });
  }

  async findOne(id: number) {
    const product = await this.prisma.product.findFirst({
      where: { id, deletedAt: null },
      include: { category: true, options: true },
    });

    if (!product) {
      throw new NotFoundException(`Product with id ${id} not found`);
    }

    return product;
  }

  async update(id: number, updateProductDto: UpdateProductDto) {
    await this.findOne(id);

    const { options, ...productData } = updateProductDto;

    if (options) {
      await this.prisma.productOption.deleteMany({ where: { productId: id } });
    }

    return this.prisma.product.update({
      where: { id },
      data: {
        ...productData,
        ...(options
          ? {
              options: {
                create: options.map((o) => ({
                  title: o.title,
                  additionalPrice: o.additionalPrice,
                })),
              },
            }
          : {}),
      },
      include: { options: true },
    });
  }

  async remove(id: number) {
    await this.findOne(id);
    return this.prisma.product.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }
}
