import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import { LoginDto } from './login.dto';

describe('LoginDto', () => {
  const validDto = {
    email: 'john@test.com',
    password: 'password123',
  };

  async function validateDto(dto: Partial<LoginDto>) {
    const instance = plainToInstance(LoginDto, dto);
    return validate(instance);
  }

  it('should pass with valid data', async () => {
    const errors = await validateDto(validDto);
    expect(errors.length).toBe(0);
  });

  it('should fail if email is missing', async () => {
    const errors = await validateDto({ password: 'password123' });
    const emailError = errors.find((e) => e.property === 'email');
    expect(emailError).toBeDefined();
  });

  it('should fail if email is invalid', async () => {
    const errors = await validateDto({ ...validDto, email: 'invalid' });
    const emailError = errors.find((e) => e.property === 'email');
    expect(emailError).toBeDefined();
  });

  it('should fail if password is missing', async () => {
    const errors = await validateDto({ email: 'john@test.com' });
    const pwError = errors.find((e) => e.property === 'password');
    expect(pwError).toBeDefined();
  });

  it('should fail if password is shorter than 8 characters', async () => {
    const errors = await validateDto({ ...validDto, password: 'short' });
    const pwError = errors.find((e) => e.property === 'password');
    expect(pwError).toBeDefined();
  });

  it('should accept password with exactly 8 characters', async () => {
    const errors = await validateDto({ ...validDto, password: '12345678' });
    expect(errors.length).toBe(0);
  });
});
