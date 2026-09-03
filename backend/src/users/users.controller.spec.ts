import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

describe('UsersController', () => {
  let controller: UsersController;
  let service: { findMe: jest.Mock; updateMe: jest.Mock };

  beforeEach(async () => {
    service = {
      findMe: jest.fn(),
      updateMe: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [{ provide: UsersService, useValue: service }],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: () => true })
      .compile();

    controller = module.get<UsersController>(UsersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('findMe calls service with userId from request', () => {
    const req = { user: { userId: 7 } };
    service.findMe.mockReturnValue({ id: 7 });

    const result = controller.findMe(req);

    expect(service.findMe).toHaveBeenCalledWith(7);
    expect(result).toEqual({ id: 7 });
  });

  it('updateMe calls service with userId and dto', () => {
    const req = { user: { userId: 7 } };
    const dto = { name: 'New Name' };
    service.updateMe.mockReturnValue({ id: 7, name: 'New Name' });

    const result = controller.updateMe(req, dto);

    expect(service.updateMe).toHaveBeenCalledWith(7, dto);
    expect(result).toEqual({ id: 7, name: 'New Name' });
  });

  it('updateMe passes all updatable fields', () => {
    const req = { user: { userId: 7 } };
    const dto = { name: 'John', phone: '123', address: '456 Oak Ave' };
    service.updateMe.mockReturnValue({ id: 7, ...dto });

    const result = controller.updateMe(req, dto);

    expect(service.updateMe).toHaveBeenCalledWith(7, dto);
    expect(result).toEqual({ id: 7, ...dto });
  });

  it('updateMe passes empty dto through', () => {
    const req = { user: { userId: 7 } };
    const dto = {};
    service.updateMe.mockReturnValue({ id: 7 });

    const result = controller.updateMe(req, dto);

    expect(service.updateMe).toHaveBeenCalledWith(7, {});
    expect(result).toEqual({ id: 7 });
  });
});
