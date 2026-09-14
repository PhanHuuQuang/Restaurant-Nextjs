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
  let res: { cookie: jest.Mock; clearCookie: jest.Mock; redirect: jest.Mock };

  beforeEach(async () => {
    authService = {
      register: jest.fn(),
      login: jest.fn(),
      signToken: jest.fn(),
      getProfile: jest.fn(),
      updateProfile: jest.fn(),
    };
    res = {
      cookie: jest.fn(),
      clearCookie: jest.fn(),
      redirect: jest.fn(),
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
    it('should call authService.register and set token cookie', async () => {
      const dto = {
        name: 'John',
        email: 'john@test.com',
        password: 'password123',
      };
      const user = {
        id: 1,
        name: 'John',
        email: 'john@test.com',
        role: 'USER',
      };
      authService.register.mockResolvedValue(user);
      authService.signToken.mockReturnValue({ accessToken: 'token' });

      const result = await controller.register(dto, res as any);

      expect(authService.register).toHaveBeenCalledWith(dto);
      expect(authService.signToken).toHaveBeenCalledWith(user);
      expect(res.cookie).toHaveBeenCalledWith(
        'token',
        'token',
        expect.any(Object),
      );
      expect(result).toEqual(user);
    });
  });

  describe('login', () => {
    it('should call authService.login and set token cookie', async () => {
      const dto = { email: 'john@test.com', password: 'password123' };
      const user = {
        id: 1,
        name: 'John',
        email: 'john@test.com',
        role: 'USER',
      };
      authService.login.mockResolvedValue(user);
      authService.signToken.mockReturnValue({ accessToken: 'token' });

      const result = await controller.login(dto, res as any);

      expect(authService.login).toHaveBeenCalledWith(dto.email, dto.password);
      expect(res.cookie).toHaveBeenCalledWith(
        'token',
        'token',
        expect.any(Object),
      );
      expect(result).toEqual(user);
    });
  });

  describe('logout', () => {
    it('should clear the token cookie', () => {
      const result = controller.logout(res as any);

      expect(res.clearCookie).toHaveBeenCalledWith('token', expect.any(Object));
      expect(res.cookie).not.toHaveBeenCalled();
      expect(result).toEqual({ success: true });
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
    it('should set token cookie and redirect without token in query', () => {
      const req = { user: { id: 1, email: 'john@test.com', role: 'USER' } };
      authService.signToken.mockReturnValue({ accessToken: 'google-token' });

      controller.googleAuthCallback(req, res as any);

      expect(authService.signToken).toHaveBeenCalledWith(req.user);
      expect(res.cookie).toHaveBeenCalledWith(
        'token',
        'google-token',
        expect.any(Object),
      );
      expect(res.redirect).toHaveBeenCalledWith(
        'http://localhost:3000/auth/callback',
      );
    });
  });
});
