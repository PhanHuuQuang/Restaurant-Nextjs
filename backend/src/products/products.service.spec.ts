import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { ProductsService } from './products.service';
import { PrismaService } from '../prisma/prisma.service';

describe('ProductsService', () => {
  let service: ProductsService;
  let prisma: {
    product: {
      create: jest.Mock;
      findMany: jest.Mock;
      findFirst: jest.Mock;
      update: jest.Mock;
    };
    productOption: {
      deleteMany: jest.Mock;
    };
  };

  const mockProduct = {
    id: 1,
    title: 'Margherita',
    desc: 'Classic pizza',
    img: '/img.png',
    price: 12.99,
    isFeatured: true,
    categoryId: 1,
    deletedAt: null,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  };

  const mockProductWithOptions = {
    ...mockProduct,
    options: [
      { id: 1, title: 'Small', additionalPrice: 0 },
      { id: 2, title: 'Large', additionalPrice: 4 },
    ],
  };

  beforeEach(async () => {
    prisma = {
      product: {
        create: jest.fn(),
        findMany: jest.fn(),
        findFirst: jest.fn(),
        update: jest.fn(),
      },
      productOption: {
        deleteMany: jest.fn(),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductsService,
        { provide: PrismaService, useValue: prisma },
      ],
    }).compile();

    service = module.get<ProductsService>(ProductsService);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a product without options', async () => {
      const dto = { title: 'Margherita', price: 12.99, categoryId: 1 };
      prisma.product.create.mockResolvedValue(mockProductWithOptions);

      const result = await service.create(dto);

      expect(prisma.product.create).toHaveBeenCalledWith({
        data: {
          title: 'Margherita',
          price: 12.99,
          categoryId: 1,
        },
        include: { options: true },
      });
      expect(result).toEqual(mockProductWithOptions);
    });

    it('should create a product with options', async () => {
      const dto = {
        title: 'Margherita',
        price: 12.99,
        categoryId: 1,
        options: [
          { title: 'Small', additionalPrice: 0 },
          { title: 'Large', additionalPrice: 4 },
        ],
      };
      prisma.product.create.mockResolvedValue(mockProductWithOptions);

      const result = await service.create(dto);

      expect(prisma.product.create).toHaveBeenCalledWith({
        data: {
          title: 'Margherita',
          price: 12.99,
          categoryId: 1,
          options: {
            create: [
              { title: 'Small', additionalPrice: 0 },
              { title: 'Large', additionalPrice: 4 },
            ],
          },
        },
        include: { options: true },
      });
      expect(result).toEqual(mockProductWithOptions);
    });
  });

  describe('findAll', () => {
    it('should return all non-deleted products without categoryId filter', async () => {
      prisma.product.findMany.mockResolvedValue([mockProductWithOptions]);

      const result = await service.findAll();

      expect(prisma.product.findMany).toHaveBeenCalledWith({
        where: { deletedAt: null },
        include: { options: true },
        orderBy: { createdAt: 'asc' },
      });
      expect(result).toEqual([mockProductWithOptions]);
    });

    it('should filter products by categoryId', async () => {
      prisma.product.findMany.mockResolvedValue([mockProductWithOptions]);

      const result = await service.findAll(1);

      expect(prisma.product.findMany).toHaveBeenCalledWith({
        where: { deletedAt: null, categoryId: 1 },
        include: { options: true },
        orderBy: { createdAt: 'asc' },
      });
      expect(result).toEqual([mockProductWithOptions]);
    });
  });

  describe('findFeatured', () => {
    it('should return featured products', async () => {
      prisma.product.findMany.mockResolvedValue([mockProductWithOptions]);

      const result = await service.findFeatured();

      expect(prisma.product.findMany).toHaveBeenCalledWith({
        where: { isFeatured: true, deletedAt: null },
        include: { options: true },
        orderBy: { createdAt: 'asc' },
      });
      expect(result).toEqual([mockProductWithOptions]);
    });
  });

  describe('findOne', () => {
    it('should return a product with category and options', async () => {
      const productWithCategory = {
        ...mockProductWithOptions,
        category: { id: 1, slug: 'pizzas', title: 'Pizzas' },
      };
      prisma.product.findFirst.mockResolvedValue(productWithCategory);

      const result = await service.findOne(1);

      expect(prisma.product.findFirst).toHaveBeenCalledWith({
        where: { id: 1, deletedAt: null },
        include: { category: true, options: true },
      });
      expect(result).toEqual(productWithCategory);
    });

    it('should throw NotFoundException when product not found', async () => {
      prisma.product.findFirst.mockResolvedValue(null);

      await expect(service.findOne(999)).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update a product without options', async () => {
      const dto = { title: 'Updated Margherita' };
      prisma.product.findFirst.mockResolvedValue(mockProductWithOptions);
      prisma.product.update.mockResolvedValue({
        ...mockProductWithOptions,
        ...dto,
      });

      const result = await service.update(1, dto);

      expect(prisma.product.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: { title: 'Updated Margherita' },
        include: { options: true },
      });
      expect(result).toEqual({ ...mockProductWithOptions, ...dto });
    });

    it('should replace options when provided', async () => {
      const dto = {
        title: 'Updated',
        options: [{ title: 'Medium', additionalPrice: 2 }],
      };
      prisma.product.findFirst.mockResolvedValue(mockProductWithOptions);
      prisma.productOption.deleteMany.mockResolvedValue({ count: 2 });
      prisma.product.update.mockResolvedValue({
        ...mockProductWithOptions,
        ...dto,
        options: [{ id: 3, title: 'Medium', additionalPrice: 2 }],
      });

      await service.update(1, dto);

      expect(prisma.productOption.deleteMany).toHaveBeenCalledWith({
        where: { productId: 1 },
      });
      expect(prisma.product.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: {
          title: 'Updated',
          options: {
            create: [{ title: 'Medium', additionalPrice: 2 }],
          },
        },
        include: { options: true },
      });
    });

    it('should throw NotFoundException when updating nonexistent product', async () => {
      prisma.product.findFirst.mockResolvedValue(null);

      await expect(service.update(999, { title: 'X' })).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('remove', () => {
    it('should soft delete a product', async () => {
      prisma.product.findFirst.mockResolvedValue(mockProductWithOptions);
      prisma.product.update.mockResolvedValue({
        ...mockProductWithOptions,
        deletedAt: new Date(),
      });

      await service.remove(1);

      expect(prisma.product.findFirst).toHaveBeenCalled();
      expect(prisma.product.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: { deletedAt: expect.any(Date) },
      });
    });

    it('should throw NotFoundException when removing nonexistent product', async () => {
      prisma.product.findFirst.mockResolvedValue(null);

      await expect(service.remove(999)).rejects.toThrow(NotFoundException);
    });
  });
});
