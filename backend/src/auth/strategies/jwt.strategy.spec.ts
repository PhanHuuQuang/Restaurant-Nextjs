import { ConfigService } from '@nestjs/config';
import { JwtStrategy } from './jwt.strategy';

describe('JwtStrategy', () => {
  let strategy: JwtStrategy;

  beforeEach(() => {
    const configService = {
      get: jest.fn().mockReturnValue('test-secret'),
    } as unknown as ConfigService;

    strategy = new JwtStrategy(configService);
  });

  it('should be defined', () => {
    expect(strategy).toBeDefined();
  });

  describe('validate', () => {
    it('should return userId, email, and role from payload', async () => {
      const payload = { sub: 1, email: 'john@test.com', role: 'USER' };

      const result = await strategy.validate(payload);

      expect(result).toEqual({
        userId: 1,
        email: 'john@test.com',
        role: 'USER',
      });
    });

    it('should work with ADMIN role', async () => {
      const payload = { sub: 2, email: 'admin@test.com', role: 'ADMIN' };

      const result = await strategy.validate(payload);

      expect(result).toEqual({
        userId: 2,
        email: 'admin@test.com',
        role: 'ADMIN',
      });
    });
  });
});
