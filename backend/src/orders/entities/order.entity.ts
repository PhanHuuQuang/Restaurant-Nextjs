import { Order, OrderItem, Status } from '../../../prisma/generated/prisma/client';
import { Decimal } from '../../../prisma/generated/prisma/internal/prismaNamespace';

export class OrderEntity implements Order {
  id: number;
  userId: number;
  subtotal: Decimal;
  deliveryCost: Decimal;
  serviceCost: Decimal;
  total: Decimal;
  status: Status;
  address: string;
  phone: string;
  items: OrderItem[];
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
}
