import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { PrismaService } from '../prisma/prisma.service';
import { Role } from '../../prisma/generated/prisma/enums';

const orderWithItems = {
  include: {
    items: true,
    user: { select: { id: true, name: true, email: true } },
  },
} as const;

@Injectable()
export class OrdersService {
  constructor(private readonly prisma: PrismaService) {}

  async create(userId: number, createOrderDto: CreateOrderDto) {
    const productIds = createOrderDto.items.map((i) => i.productId);
    const products = await this.prisma.product.findMany({
      where: { id: { in: productIds }, deletedAt: null },
      include: { options: true },
    });

    if (products.length !== productIds.length) {
      throw new BadRequestException('One or more products not found');
    }

    const orderItems = createOrderDto.items.map((item) => {
      const product = products.find((p) => p.id === item.productId)!;
      let unitPrice = product.price;

      if (item.sizeOption) {
        const option = product.options.find((o) => o.title === item.sizeOption);
        if (!option) {
          throw new BadRequestException(
            `Invalid size option "${item.sizeOption}" for product "${product.title}"`,
          );
        }
        unitPrice = unitPrice.plus(option.additionalPrice);
      }

      return {
        productId: product.id,
        quantity: item.quantity ?? 1,
        sizeOption: item.sizeOption ?? null,
        price: unitPrice,
      };
    });

    const subtotal = orderItems.reduce(
      (sum, i) => sum + i.price.toNumber() * i.quantity,
      0,
    );
    const serviceCost = Math.round(subtotal * 0.05 * 100) / 100;
    const deliveryCost = 0;
    const total =
      Math.round((subtotal + serviceCost + deliveryCost) * 100) / 100;

    return this.prisma.$transaction((tx) =>
      tx.order.create({
        data: {
          userId,
          subtotal,
          serviceCost,
          deliveryCost,
          total,
          address: createOrderDto.address,
          phone: createOrderDto.phone,
          items: { create: orderItems },
        },
        ...orderWithItems,
      }),
    );
  }

  findMyOrders(userId: number) {
    return this.prisma.order.findMany({
      where: { userId, deletedAt: null },
      ...orderWithItems,
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: number, userId: number, userRole: Role) {
    const order = await this.prisma.order.findUnique({
      where: { id, deletedAt: null },
      ...orderWithItems,
    });

    if (!order) throw new NotFoundException('Order not found');
    if (order.userId !== userId && userRole !== Role.ADMIN) {
      throw new ForbiddenException('Access denied');
    }

    return order;
  }
}
