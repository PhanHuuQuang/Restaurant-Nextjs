import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { UsersService } from './users.service';
import { PrismaService } from '../prisma/prisma.service';

describe('UsersService', () => {
  let service: UsersService;
  let prisma: {
    user: { findUnique: jest.Mock; update: jest.Mock };
  };

  beforeEach(async () => {
    prisma = {
      user: {
        findUnique: jest.fn(),
        update: jest.fn(),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [UsersService, { provide: PrismaService, useValue: prisma }],
    }).compile();

    service = module.get<UsersService>(UsersService);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findMe', () => {
    it('should return the user without password', async () => {
      const safeUser = {
        id: 1,
        name: 'John',
        email: 'john@test.com',
        image: null,
        phone: null,
        address: null,
        role: 'USER',
      };
      prisma.user.findUnique.mockResolvedValue(safeUser);

      const result = await service.findMe(1);

      expect(prisma.user.findUnique).toHaveBeenCalledWith({
        where: { id: 1 },
        select: expect.objectContaining({
          name: true,
          email: true,
          address: true,
        }),
      });
      expect(result).toEqual(safeUser);
      expect(result).not.toHaveProperty('password');
    });

    it('should throw NotFoundException if user does not exist', async () => {
      prisma.user.findUnique.mockResolvedValue(null);

      await expect(service.findMe(99)).rejects.toThrow(NotFoundException);
    });
  });

  describe('updateMe', () => {
    it('should update the user and return sanitized user', async () => {
      prisma.user.findUnique.mockResolvedValue({ id: 1, name: 'John' });
      const updated = {
        id: 1,
        name: 'Johnny',
        email: 'john@test.com',
        image: null,
        phone: '123',
        address: '123 Main St',
        role: 'USER',
      };
      prisma.user.update.mockResolvedValue(updated);

      const result = await service.updateMe(1, {
        name: 'Johnny',
        address: '123 Main St',
      });

      expect(prisma.user.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: { name: 'Johnny', address: '123 Main St' },
        select: expect.objectContaining({ address: true }),
      });
      expect(result).toEqual(updated);
      expect(result).not.toHaveProperty('password');
    });

    it('should update only phone field', async () => {
      prisma.user.findUnique.mockResolvedValue({ id: 1, name: 'John' });
      prisma.user.update.mockResolvedValue({
        id: 1,
        name: 'John',
        email: 'john@test.com',
        image: null,
        phone: '9876543210',
        address: null,
        role: 'USER',
      });

      await service.updateMe(1, { phone: '9876543210' });

      expect(prisma.user.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: { phone: '9876543210' },
        select: expect.objectContaining({ phone: true }),
      });
    });

    it('should update only address field', async () => {
      prisma.user.findUnique.mockResolvedValue({ id: 1, name: 'John' });
      prisma.user.update.mockResolvedValue({
        id: 1,
        name: 'John',
        email: 'john@test.com',
        image: null,
        phone: null,
        address: '456 Oak Ave',
        role: 'USER',
      });

      await service.updateMe(1, { address: '456 Oak Ave' });

      expect(prisma.user.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: { address: '456 Oak Ave' },
        select: expect.objectContaining({ address: true }),
      });
    });

    it('should pass empty dto without errors', async () => {
      prisma.user.findUnique.mockResolvedValue({ id: 1, name: 'John' });
      prisma.user.update.mockResolvedValue({
        id: 1,
        name: 'John',
        email: 'john@test.com',
        image: null,
        phone: null,
        address: null,
        role: 'USER',
      });

      const result = await service.updateMe(1, {});

      expect(prisma.user.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: {},
        select: expect.objectContaining({ id: true }),
      });
      expect(result).not.toHaveProperty('password');
    });

    it('should throw NotFoundException if user does not exist', async () => {
      prisma.user.findUnique.mockResolvedValue(null);

      await expect(service.updateMe(99, { name: 'X' })).rejects.toThrow(
        NotFoundException,
      );
      expect(prisma.user.update).not.toHaveBeenCalled();
    });
  });
});
