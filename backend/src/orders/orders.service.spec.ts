import { Test, TestingModule } from '@nestjs/testing';
import {
  BadRequestException,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { Decimal } from '../../prisma/generated/prisma/internal/prismaNamespace';
import { OrdersService } from './orders.service';
import { PrismaService } from '../prisma/prisma.service';
import { Role, Status } from '../../prisma/generated/prisma/enums';

describe('OrdersService', () => {
  let service: OrdersService;
  let prisma: {
    product: { findMany: jest.Mock };
    order: {
      findUnique: jest.Mock;
      findMany: jest.Mock;
      create: jest.Mock;
      update: jest.Mock;
      count: jest.Mock;
    };
    $transaction: jest.Mock;
  };

  const mockProduct = {
    id: 1,
    title: 'Pizza',
    price: new Decimal('10.00'),
    options: [{ id: 1, title: 'Large', additionalPrice: new Decimal('5.00') }],
  };

  const mockOrder = {
    id: 1,
    userId: 1,
    subtotal: new Decimal('15.00'),
    deliveryCost: new Decimal('0.00'),
    serviceCost: new Decimal('0.75'),
    total: new Decimal('15.75'),
    status: 'PENDING',
    address: '123 Main St',
    phone: '1234567890',
    items: [
      {
        id: 1,
        productId: 1,
        quantity: 1,
        sizeOption: 'Large',
        price: new Decimal('15.00'),
      },
    ],
    user: { id: 1, name: 'John', email: 'john@test.com' },
  };

  beforeEach(async () => {
    prisma = {
      product: { findMany: jest.fn() },
      order: {
        findUnique: jest.fn(),
        findMany: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
        count: jest.fn(),
      },
      $transaction: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [OrdersService, { provide: PrismaService, useValue: prisma }],
    }).compile();

    service = module.get<OrdersService>(OrdersService);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create an order with computed totals', async () => {
      prisma.product.findMany.mockResolvedValue([mockProduct]);
      prisma.$transaction.mockImplementation((fn: (tx: any) => unknown) =>
        fn({
          order: { create: jest.fn().mockResolvedValue(mockOrder) },
        }),
      );

      const result = await service.create(1, {
        address: '123 Main St',
        phone: '1234567890',
        items: [{ productId: 1, quantity: 1, sizeOption: 'Large' }],
      });

      expect(prisma.product.findMany).toHaveBeenCalledWith({
        where: { id: { in: [1] }, deletedAt: null },
        include: { options: true },
      });
      expect(prisma.$transaction).toHaveBeenCalled();
      expect(result).toEqual(mockOrder);
    });

    it('should throw BadRequestException if product not found', async () => {
      prisma.product.findMany.mockResolvedValue([]);

      await expect(
        service.create(1, {
          address: '123 Main St',
          phone: '1234567890',
          items: [{ productId: 99, quantity: 1 }],
        }),
      ).rejects.toThrow(BadRequestException);
    });

    it('should throw BadRequestException for invalid size option', async () => {
      prisma.product.findMany.mockResolvedValue([mockProduct]);

      await expect(
        service.create(1, {
          address: '123 Main St',
          phone: '1234567890',
          items: [{ productId: 1, quantity: 1, sizeOption: 'Invalid' }],
        }),
      ).rejects.toThrow(BadRequestException);
    });

    it('should compute totals correctly without size option', async () => {
      const productNoOption = {
        ...mockProduct,
        options: [],
      };
      prisma.product.findMany.mockResolvedValue([productNoOption]);
      const createdOrder = {
        ...mockOrder,
        subtotal: new Decimal('20.00'),
        serviceCost: new Decimal('1.00'),
        total: new Decimal('21.00'),
        items: [
          {
            ...mockOrder.items[0],
            sizeOption: null,
            price: new Decimal('10.00'),
          },
        ],
      };
      prisma.$transaction.mockImplementation((fn: (tx: any) => unknown) =>
        fn({ order: { create: jest.fn().mockResolvedValue(createdOrder) } }),
      );

      const result = await service.create(1, {
        address: '123 Main St',
        phone: '1234567890',
        items: [{ productId: 1, quantity: 2 }],
      });

      expect(result.subtotal).toEqual(new Decimal('20.00'));
      expect(result.serviceCost).toEqual(new Decimal('1.00'));
    });
  });

  describe('findMyOrders', () => {
    it('should return orders for the given user', async () => {
      prisma.order.findMany.mockResolvedValue([mockOrder]);

      const result = await service.findMyOrders(1);

      expect(prisma.order.findMany).toHaveBeenCalledWith({
        where: { userId: 1, deletedAt: null },
        include: expect.objectContaining({ items: true }),
        orderBy: { createdAt: 'desc' },
      });
      expect(result).toEqual([mockOrder]);
    });

    it('should return empty array if user has no orders', async () => {
      prisma.order.findMany.mockResolvedValue([]);

      const result = await service.findMyOrders(99);

      expect(result).toEqual([]);
    });
  });

  describe('findOne', () => {
    it('should return order for owner', async () => {
      prisma.order.findUnique.mockResolvedValue(mockOrder);

      const result = await service.findOne(1, 1, Role.USER);

      expect(result).toEqual(mockOrder);
    });

    it('should return order for admin', async () => {
      prisma.order.findUnique.mockResolvedValue(mockOrder);

      const result = await service.findOne(1, 99, Role.ADMIN);

      expect(result).toEqual(mockOrder);
    });

    it('should throw NotFoundException if order not found', async () => {
      prisma.order.findUnique.mockResolvedValue(null);

      await expect(service.findOne(99, 1, Role.USER)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw ForbiddenException if not owner and not admin', async () => {
      prisma.order.findUnique.mockResolvedValue(mockOrder);

      await expect(service.findOne(1, 99, Role.USER)).rejects.toThrow(
        ForbiddenException,
      );
    });
  });

  describe('findAll', () => {
    it('should return paginated orders with meta', async () => {
      prisma.$transaction.mockResolvedValue([[mockOrder], 1]);

      const result = await service.findAll({ page: 1, limit: 10 });

      expect(prisma.order.findMany).toHaveBeenCalledWith({
        skip: 0,
        take: 10,
        where: { deletedAt: null },
        include: expect.objectContaining({ items: true }),
        orderBy: { createdAt: 'desc' },
      });
      expect(prisma.order.count).toHaveBeenCalledWith({
        where: { deletedAt: null },
      });
      expect(result).toEqual({
        data: [mockOrder],
        meta: { page: 1, limit: 10, total: 1, totalPages: 1 },
      });
    });

    it('should compute skip/take and totalPages correctly for custom page', async () => {
      prisma.$transaction.mockResolvedValue([[mockOrder], 25]);

      const result = await service.findAll({ page: 3, limit: 10 });

      expect(prisma.order.findMany).toHaveBeenCalledWith({
        skip: 20,
        take: 10,
        where: { deletedAt: null },
        include: expect.objectContaining({ items: true }),
        orderBy: { createdAt: 'desc' },
      });
      expect(result.meta).toEqual({
        page: 3,
        limit: 10,
        total: 25,
        totalPages: 3,
      });
    });

    it('should return empty data when no orders exist', async () => {
      prisma.$transaction.mockResolvedValue([[], 0]);

      const result = await service.findAll({ page: 1, limit: 10 });

      expect(result).toEqual({
        data: [],
        meta: { page: 1, limit: 10, total: 0, totalPages: 0 },
      });
    });
  });

  describe('updateStatus', () => {
    it('should transition PENDING to PAID', async () => {
      prisma.order.findUnique.mockResolvedValue({
        ...mockOrder,
        status: Status.PENDING,
      });
      const updated = { ...mockOrder, status: Status.PAID };
      prisma.order.update.mockResolvedValue(updated);

      const result = await service.updateStatus(1, Status.PAID);

      expect(prisma.order.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: { status: Status.PAID },
        include: expect.objectContaining({ items: true }),
      });
      expect(result).toEqual(updated);
    });

    it('should transition PENDING to CANCELLED', async () => {
      prisma.order.findUnique.mockResolvedValue({
        ...mockOrder,
        status: Status.PENDING,
      });
      const updated = { ...mockOrder, status: Status.CANCELLED };
      prisma.order.update.mockResolvedValue(updated);

      const result = await service.updateStatus(1, Status.CANCELLED);

      expect(result.status).toBe(Status.CANCELLED);
    });

    it('should transition PAID to DELIVERED', async () => {
      prisma.order.findUnique.mockResolvedValue({
        ...mockOrder,
        status: Status.PAID,
      });
      const updated = { ...mockOrder, status: Status.DELIVERED };
      prisma.order.update.mockResolvedValue(updated);

      const result = await service.updateStatus(1, Status.DELIVERED);

      expect(result.status).toBe(Status.DELIVERED);
    });

    it('should throw BadRequestException for invalid transition (PENDING to DELIVERED)', async () => {
      prisma.order.findUnique.mockResolvedValue({
        ...mockOrder,
        status: Status.PENDING,
      });

      await expect(service.updateStatus(1, Status.DELIVERED)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should throw BadRequestException from terminal state (DELIVERED)', async () => {
      prisma.order.findUnique.mockResolvedValue({
        ...mockOrder,
        status: Status.DELIVERED,
      });

      await expect(service.updateStatus(1, Status.PAID)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should throw NotFoundException if order not found', async () => {
      prisma.order.findUnique.mockResolvedValue(null);

      await expect(service.updateStatus(99, Status.PAID)).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
