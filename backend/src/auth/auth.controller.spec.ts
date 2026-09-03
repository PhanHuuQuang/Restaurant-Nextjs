import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

describe('AuthController', () => {
  let controller: AuthController;
  let authService: {
    register: jest.Mock;
    login: jest.Mock;
    signToken: jest.Mock;
    getProfile: jest.Mock;
    updateProfile: jest.Mock;
  };

  beforeEach(async () => {
    authService = {
      register: jest.fn(),
      login: jest.fn(),
      signToken: jest.fn(),
      getProfile: jest.fn(),
      updateProfile: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [{ provide: AuthService, useValue: authService }],
    }).compile();

    controller = module.get<AuthController>(AuthController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('register', () => {
    it('should call authService.register with dto', async () => {
      const dto = {
        name: 'John',
        email: 'john@test.com',
        password: 'password123',
      };
      authService.register.mockResolvedValue({ accessToken: 'token' });

      const result = await controller.register(dto);

      expect(authService.register).toHaveBeenCalledWith(dto);
      expect(result).toEqual({ accessToken: 'token' });
    });
  });

  describe('login', () => {
    it('should call authService.login with email and password', async () => {
      const dto = { email: 'john@test.com', password: 'password123' };
      authService.login.mockResolvedValue({ accessToken: 'token' });

      const result = await controller.login(dto);

      expect(authService.login).toHaveBeenCalledWith(dto.email, dto.password);
      expect(result).toEqual({ accessToken: 'token' });
    });
  });

  describe('profile', () => {
    it('should call authService.getProfile with userId from request', async () => {
      const req = { user: { userId: 1 } };
      authService.getProfile.mockResolvedValue({
        id: 1,
        email: 'john@test.com',
        role: 'USER',
      });

      const result = await controller.profile(req);

      expect(authService.getProfile).toHaveBeenCalledWith(1);
      expect(result).toEqual({ id: 1, email: 'john@test.com', role: 'USER' });
    });
  });

  describe('updateProfile', () => {
    it('should call authService.updateProfile with userId and dto', async () => {
      const req = { user: { userId: 1 } };
      const dto = { name: 'John' };
      authService.updateProfile.mockResolvedValue({ id: 1, name: 'John' });

      const result = await controller.updateProfile(req, dto);

      expect(authService.updateProfile).toHaveBeenCalledWith(1, dto);
      expect(result).toEqual({ id: 1, name: 'John' });
    });
  });

  describe('uploadAvatar', () => {
    it('should call authService.updateProfile with image url', async () => {
      const req = { user: { userId: 1 } };
      const file = { filename: 'avatar.jpg' } as Express.Multer.File;
      authService.updateProfile.mockResolvedValue({
        id: 1,
        image: '/uploads/avatars/avatar.jpg',
      });

      const result = await controller.uploadAvatar(req, file);

      expect(authService.updateProfile).toHaveBeenCalledWith(1, {
        image: '/uploads/avatars/avatar.jpg',
      });
      expect(result).toEqual({ id: 1, image: '/uploads/avatars/avatar.jpg' });
    });
  });

  describe('googleAuthCallback', () => {
    it('should redirect with token', () => {
      const req = { user: { id: 1, email: 'john@test.com', role: 'USER' } };
      const res = { redirect: jest.fn() };
      authService.signToken.mockReturnValue({ accessToken: 'google-token' });

      controller.googleAuthCallback(req, res as any);

      expect(authService.signToken).toHaveBeenCalledWith(req.user);
      expect(res.redirect).toHaveBeenCalledWith(
        'http://localhost:3000/auth/callback?token=google-token',
      );
    });
  });
});
