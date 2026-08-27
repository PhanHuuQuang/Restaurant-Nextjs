import { Test, TestingModule } from '@nestjs/testing';
import { CategoriesController } from './categories.controller';
import { CategoriesService } from './categories.service';

describe('CategoriesController', () => {
  let controller: CategoriesController;
  let service: {
    create: jest.Mock;
    findAll: jest.Mock;
    findOne: jest.Mock;
    update: jest.Mock;
    remove: jest.Mock;
  };

  const mockCategory = {
    id: 1,
    slug: 'pizzas',
    title: 'Cheesy Pizzas',
    description: 'Pizza Paradise',
    image: '/img.png',
    color: 'white',
  };

  beforeEach(async () => {
    service = {
      create: jest.fn().mockResolvedValue(mockCategory),
      findAll: jest.fn().mockResolvedValue([mockCategory]),
      findOne: jest.fn().mockResolvedValue(mockCategory),
      update: jest.fn().mockResolvedValue({ ...mockCategory, title: 'Updated' }),
      remove: jest.fn().mockResolvedValue({ ...mockCategory, deletedAt: new Date() }),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [CategoriesController],
      providers: [{ provide: CategoriesService, useValue: service }],
    }).compile();

    controller = module.get<CategoriesController>(CategoriesController);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should call service.create with dto', async () => {
      const dto = { slug: 'pizzas', title: 'Cheesy Pizzas' };
      const result = await controller.create(dto);

      expect(service.create).toHaveBeenCalledWith(dto);
      expect(result).toEqual(mockCategory);
    });
  });

  describe('findAll', () => {
    it('should call service.findAll', async () => {
      const result = await controller.findAll();

      expect(service.findAll).toHaveBeenCalled();
      expect(result).toEqual([mockCategory]);
    });
  });

  describe('findOne', () => {
    it('should call service.findOne with slug', async () => {
      const result = await controller.findOne('pizzas');

      expect(service.findOne).toHaveBeenCalledWith('pizzas');
      expect(result).toEqual(mockCategory);
    });
  });

  describe('update', () => {
    it('should call service.update with slug and dto', async () => {
      const dto = { title: 'Updated' };
      const result = await controller.update('pizzas', dto);

      expect(service.update).toHaveBeenCalledWith('pizzas', dto);
      expect(result).toEqual({ ...mockCategory, title: 'Updated' });
    });
  });

  describe('remove', () => {
    it('should call service.remove with slug', async () => {
      const result = await controller.remove('pizzas');

      expect(service.remove).toHaveBeenCalledWith('pizzas');
      expect(result).toEqual({ ...mockCategory, deletedAt: expect.any(Date) });
    });
  });
});
