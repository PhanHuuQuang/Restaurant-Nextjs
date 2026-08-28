import { Test, TestingModule } from '@nestjs/testing';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';

describe('ProductsController', () => {
  let controller: ProductsController;
  let service: {
    create: jest.Mock;
    findAll: jest.Mock;
    findFeatured: jest.Mock;
    findOne: jest.Mock;
    update: jest.Mock;
    remove: jest.Mock;
  };

  const mockProduct = {
    id: 1,
    title: 'Margherita',
    desc: 'Classic pizza',
    price: 12.99,
    options: [{ id: 1, title: 'Small', additionalPrice: 0 }],
  };

  beforeEach(async () => {
    service = {
      create: jest.fn().mockResolvedValue(mockProduct),
      findAll: jest.fn().mockResolvedValue([mockProduct]),
      findFeatured: jest.fn().mockResolvedValue([mockProduct]),
      findOne: jest.fn().mockResolvedValue(mockProduct),
      update: jest.fn().mockResolvedValue({ ...mockProduct, title: 'Updated' }),
      remove: jest
        .fn()
        .mockResolvedValue({ ...mockProduct, deletedAt: new Date() }),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductsController],
      providers: [{ provide: ProductsService, useValue: service }],
    }).compile();

    controller = module.get<ProductsController>(ProductsController);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should call service.create with dto', async () => {
      const dto = { title: 'Margherita', price: 12.99, categoryId: 1 };
      const result = await controller.create(dto);

      expect(service.create).toHaveBeenCalledWith(dto);
      expect(result).toEqual(mockProduct);
    });
  });

  describe('findAll', () => {
    it('should call service.findAll without categoryId', async () => {
      const result = await controller.findAll(undefined);

      expect(service.findAll).toHaveBeenCalledWith(undefined);
      expect(result).toEqual([mockProduct]);
    });

    it('should call service.findAll with parsed categoryId', async () => {
      const result = await controller.findAll('1');

      expect(service.findAll).toHaveBeenCalledWith(1);
      expect(result).toEqual([mockProduct]);
    });
  });

  describe('findFeatured', () => {
    it('should call service.findFeatured', async () => {
      const result = await controller.findFeatured();

      expect(service.findFeatured).toHaveBeenCalled();
      expect(result).toEqual([mockProduct]);
    });
  });

  describe('findOne', () => {
    it('should call service.findOne with id', async () => {
      const result = await controller.findOne(1);

      expect(service.findOne).toHaveBeenCalledWith(1);
      expect(result).toEqual(mockProduct);
    });
  });

  describe('update', () => {
    it('should call service.update with id and dto', async () => {
      const dto = { title: 'Updated' };
      const result = await controller.update(1, dto);

      expect(service.update).toHaveBeenCalledWith(1, dto);
      expect(result).toEqual({ ...mockProduct, title: 'Updated' });
    });
  });

  describe('remove', () => {
    it('should call service.remove with id', async () => {
      const result = await controller.remove(1);

      expect(service.remove).toHaveBeenCalledWith(1);
      expect(result).toEqual({ ...mockProduct, deletedAt: expect.any(Date) });
    });
  });
});
