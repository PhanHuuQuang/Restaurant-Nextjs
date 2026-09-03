import { Test, TestingModule } from '@nestjs/testing';
import { ConflictException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcryptjs';

jest.mock('bcryptjs');

describe('AuthService', () => {
  let service: AuthService;
  let prisma: { user: { findUnique: jest.Mock; create: jest.Mock } };
  let jwt: { sign: jest.Mock };

  beforeEach(async () => {
    prisma = {
      user: {
        findUnique: jest.fn(),
        create: jest.fn(),
      },
    };
    jwt = { sign: jest.fn().mockReturnValue('mock-jwt-token') };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: PrismaService, useValue: prisma },
        { provide: JwtService, useValue: jwt },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('register', () => {
    const dto = {
      name: 'John',
      email: 'john@test.com',
      password: 'password123',
    };

    it('should register a new user and return token', async () => {
      prisma.user.findUnique.mockResolvedValue(null);
      (bcrypt.hash as jest.Mock).mockResolvedValue('hashed-password');
      prisma.user.create.mockResolvedValue({
        id: 1,
        name: 'John',
        email: 'john@test.com',
        role: 'USER',
      });
      jwt.sign.mockReturnValue('jwt-token');

      const result = await service.register(dto);

      expect(prisma.user.findUnique).toHaveBeenCalledWith({
        where: { email: dto.email },
      });
      expect(bcrypt.hash).toHaveBeenCalledWith(dto.password, 10);
      expect(prisma.user.create).toHaveBeenCalledWith({
        data: { name: dto.name, email: dto.email, password: 'hashed-password' },
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
          image: true,
          role: true,
        },
      });
      expect(result).toEqual({ accessToken: 'jwt-token' });
    });

    it('should throw ConflictException if email already exists', async () => {
      prisma.user.findUnique.mockResolvedValue({
        id: 1,
        email: 'john@test.com',
      });

      await expect(service.register(dto)).rejects.toThrow(ConflictException);
      expect(prisma.user.create).not.toHaveBeenCalled();
    });
  });

  describe('login', () => {
    it('should return a token for valid credentials', async () => {
      const user = {
        id: 1,
        email: 'john@test.com',
        password: 'hashed',
        role: 'USER',
      };
      prisma.user.findUnique.mockResolvedValue(user);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);
      jwt.sign.mockReturnValue('jwt-token');

      const result = await service.login('john@test.com', 'password123');

      expect(prisma.user.findUnique).toHaveBeenCalledWith({
        where: { email: 'john@test.com' },
      });
      expect(bcrypt.compare).toHaveBeenCalledWith('password123', 'hashed');
      expect(result).toEqual({ accessToken: 'jwt-token' });
    });

    it('should throw UnauthorizedException if user not found', async () => {
      prisma.user.findUnique.mockResolvedValue(null);

      await expect(
        service.login('nobody@test.com', 'password123'),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('should throw UnauthorizedException if password is wrong', async () => {
      prisma.user.findUnique.mockResolvedValue({
        id: 1,
        email: 'john@test.com',
        password: 'hashed',
      });
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      await expect(service.login('john@test.com', 'wrong')).rejects.toThrow(
        UnauthorizedException,
      );
    });

    it('should throw UnauthorizedException if user has no password (OAuth user)', async () => {
      prisma.user.findUnique.mockResolvedValue({
        id: 1,
        email: 'john@test.com',
        password: null,
      });

      await expect(
        service.login('john@test.com', 'password123'),
      ).rejects.toThrow(UnauthorizedException);
    });
  });

  describe('signToken', () => {
    it('should return an object with accessToken', () => {
      jwt.sign.mockReturnValue('signed-token');

      const result = service.signToken({
        id: 1,
        email: 'test@test.com',
        role: 'USER',
      });

      expect(jwt.sign).toHaveBeenCalledWith({
        sub: 1,
        email: 'test@test.com',
        role: 'USER',
      });
      expect(result).toEqual({ accessToken: 'signed-token' });
    });
  });
});
