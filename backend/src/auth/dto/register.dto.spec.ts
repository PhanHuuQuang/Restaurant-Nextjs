import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import { RegisterDto } from './register.dto';

describe('RegisterDto', () => {
  const validDto = {
    name: 'John Doe',
    email: 'john@test.com',
    password: 'password123',
  };

  async function validateDto(dto: Partial<RegisterDto>) {
    const instance = plainToInstance(RegisterDto, dto);
    return validate(instance);
  }

  it('should pass with valid data', async () => {
    const errors = await validateDto(validDto);
    expect(errors.length).toBe(0);
  });

  it('should pass with optional phone', async () => {
    const errors = await validateDto({ ...validDto, phone: '1234567890' });
    expect(errors.length).toBe(0);
  });

  it('should fail if name is missing', async () => {
    const errors = await validateDto({
      email: 'john@test.com',
      password: 'password123',
    });
    const nameError = errors.find((e) => e.property === 'name');
    expect(nameError).toBeDefined();
  });

  it('should fail if name is empty string', async () => {
    const errors = await validateDto({ ...validDto, name: '' });
    const nameError = errors.find((e) => e.property === 'name');
    expect(nameError).toBeDefined();
  });

  it('should fail if email is invalid', async () => {
    const errors = await validateDto({ ...validDto, email: 'not-an-email' });
    const emailError = errors.find((e) => e.property === 'email');
    expect(emailError).toBeDefined();
  });

  it('should fail if email is missing', async () => {
    const errors = await validateDto({ name: 'John', password: 'password123' });
    const emailError = errors.find((e) => e.property === 'email');
    expect(emailError).toBeDefined();
  });

  it('should fail if password is missing', async () => {
    const errors = await validateDto({ name: 'John', email: 'john@test.com' });
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
