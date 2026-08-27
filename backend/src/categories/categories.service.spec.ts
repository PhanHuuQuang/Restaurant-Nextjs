import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { PrismaService } from '../prisma/prisma.service';

describe('CategoriesService', () => {
  let service: CategoriesService;
  let prisma: {
    category: {
      create: jest.Mock;
      findMany: jest.Mock;
      findFirst: jest.Mock;
      update: jest.Mock;
    };
  };

  const mockCategory = {
    id: 1,
    slug: 'pizzas',
    title: 'Cheesy Pizzas',
    description: 'Pizza Paradise',
    image: '/img.png',
    color: 'white',
    deletedAt: null,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  };

  beforeEach(async () => {
    prisma = {
      category: {
        create: jest.fn(),
        findMany: jest.fn(),
        findFirst: jest.fn(),
        update: jest.fn(),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CategoriesService,
        { provide: PrismaService, useValue: prisma },
      ],
    }).compile();

    service = module.get<CategoriesService>(CategoriesService);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a category', async () => {
      const dto = { slug: 'pizzas', title: 'Cheesy Pizzas' };
      prisma.category.create.mockResolvedValue(mockCategory);

      const result = await service.create(dto);

      expect(prisma.category.create).toHaveBeenCalledWith({ data: dto });
      expect(result).toEqual(mockCategory);
    });
  });

  describe('findAll', () => {
    it('should return all non-deleted categories ordered by createdAt asc', async () => {
      const categories = [mockCategory];
      prisma.category.findMany.mockResolvedValue(categories);

      const result = await service.findAll();

      expect(prisma.category.findMany).toHaveBeenCalledWith({
        where: { deletedAt: null },
        orderBy: { createdAt: 'asc' },
      });
      expect(result).toEqual(categories);
    });

    it('should return empty array when no categories exist', async () => {
      prisma.category.findMany.mockResolvedValue([]);

      const result = await service.findAll();

      expect(result).toEqual([]);
    });
  });

  describe('findOne', () => {
    it('should return a category with products by slug', async () => {
      const categoryWithProducts = {
        ...mockCategory,
        products: [
          { id: 1, title: 'Margherita', price: 12, deletedAt: null },
        ],
      };
      prisma.category.findFirst.mockResolvedValue(categoryWithProducts);

      const result = await service.findOne('pizzas');

      expect(prisma.category.findFirst).toHaveBeenCalledWith({
        where: { slug: 'pizzas', deletedAt: null },
        include: { products: { where: { deletedAt: null } } },
      });
      expect(result).toEqual(categoryWithProducts);
    });

    it('should throw NotFoundException when category not found', async () => {
      prisma.category.findFirst.mockResolvedValue(null);

      await expect(service.findOne('nonexistent')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('update', () => {
    it('should update a category by slug', async () => {
      const dto = { title: 'Updated Title' };
      const updatedCategory = { ...mockCategory, ...dto };
      prisma.category.update.mockResolvedValue(updatedCategory);

      const result = await service.update('pizzas', dto);

      expect(prisma.category.update).toHaveBeenCalledWith({
        where: { slug: 'pizzas' },
        data: dto,
      });
      expect(result).toEqual(updatedCategory);
    });
  });

  describe('remove', () => {
    it('should soft delete a category', async () => {
      prisma.category.findFirst.mockResolvedValue(mockCategory);
      prisma.category.update.mockResolvedValue({
        ...mockCategory,
        deletedAt: new Date(),
      });

      await service.remove('pizzas');

      expect(prisma.category.findFirst).toHaveBeenCalled();
      expect(prisma.category.update).toHaveBeenCalledWith({
        where: { slug: 'pizzas' },
        data: { deletedAt: expect.any(Date) },
      });
    });

    it('should throw NotFoundException when removing nonexistent category', async () => {
      prisma.category.findFirst.mockResolvedValue(null);

      await expect(service.remove('nonexistent')).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
