import { Test, TestingModule } from '@nestjs/testing';
import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../shared/guards/role.guard';

describe('OrdersController', () => {
  let controller: OrdersController;
  let service: {
    create: jest.Mock;
    findMyOrders: jest.Mock;
    findOne: jest.Mock;
    findAll: jest.Mock;
    updateStatus: jest.Mock;
  };

  beforeEach(async () => {
    service = {
      create: jest.fn(),
      findMyOrders: jest.fn(),
      findOne: jest.fn(),
      findAll: jest.fn(),
      updateStatus: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [OrdersController],
      providers: [{ provide: OrdersService, useValue: service }],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: () => true })
      .overrideGuard(RolesGuard)
      .useValue({ canActivate: () => true })
      .compile();

    controller = module.get<OrdersController>(OrdersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll', () => {
    it('should call service.findAll with query', () => {
      const query = { page: 1, limit: 10 };
      service.findAll.mockResolvedValue({ data: [], meta: {} });

      const result = controller.findAll(query);

      expect(service.findAll).toHaveBeenCalledWith(query);
      expect(result).resolves.toEqual({ data: [], meta: {} });
    });
  });

  describe('create', () => {
    it('should call service.create with userId and dto', () => {
      const req = { user: { userId: 1 } };
      const dto = {
        address: '123 Main St',
        phone: '123',
        items: [{ productId: 1, quantity: 1 }],
      };
      service.create.mockResolvedValue({ id: 1 });

      const result = controller.create(req, dto);

      expect(service.create).toHaveBeenCalledWith(1, dto);
      expect(result).resolves.toEqual({ id: 1 });
    });
  });

  describe('findMyOrders', () => {
    it('should call service.findMyOrders with userId', () => {
      const req = { user: { userId: 1 } };
      service.findMyOrders.mockResolvedValue([{ id: 1 }]);

      const result = controller.findMyOrders(req);

      expect(service.findMyOrders).toHaveBeenCalledWith(1);
      expect(result).resolves.toEqual([{ id: 1 }]);
    });
  });

  describe('findOne', () => {
    it('should call service.findOne with id, userId, and role', () => {
      const req = { user: { userId: 1, role: 'USER' } };
      service.findOne.mockResolvedValue({ id: 1 });

      const result = controller.findOne(1, req);

      expect(service.findOne).toHaveBeenCalledWith(1, 1, 'USER');
      expect(result).resolves.toEqual({ id: 1 });
    });
  });

  describe('updateStatus', () => {
    it('should call service.updateStatus with id and status', () => {
      const dto = { status: 'PAID' as const };
      service.updateStatus.mockResolvedValue({ id: 1, status: 'PAID' });

      const result = controller.updateStatus(1, dto);

      expect(service.updateStatus).toHaveBeenCalledWith(1, 'PAID');
      expect(result).resolves.toEqual({ id: 1, status: 'PAID' });
    });
  });
});
