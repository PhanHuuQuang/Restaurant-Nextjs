import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import { UpdateUserDto } from './update-user.dto';

describe('UpdateUserDto', () => {
  async function validateDto(dto: Partial<UpdateUserDto>) {
    const instance = plainToInstance(UpdateUserDto, dto);
    return validate(instance);
  }

  it('should pass with empty object (all fields optional)', async () => {
    const errors = await validateDto({});
    expect(errors.length).toBe(0);
  });

  it('should pass with valid name only', async () => {
    const errors = await validateDto({ name: 'John' });
    expect(errors.length).toBe(0);
  });

  it('should pass with valid phone only', async () => {
    const errors = await validateDto({ phone: '1234567890' });
    expect(errors.length).toBe(0);
  });

  it('should pass with valid address only', async () => {
    const errors = await validateDto({ address: '123 Main St' });
    expect(errors.length).toBe(0);
  });

  it('should pass with all fields provided', async () => {
    const errors = await validateDto({
      name: 'John Doe',
      phone: '1234567890',
      address: '123 Main St',
    });
    expect(errors.length).toBe(0);
  });

  it('should fail if name is not a string', async () => {
    const errors = await validateDto({ name: 123 as any });
    const nameError = errors.find((e) => e.property === 'name');
    expect(nameError).toBeDefined();
  });

  it('should fail if phone is not a string', async () => {
    const errors = await validateDto({ phone: 123 as any });
    const phoneError = errors.find((e) => e.property === 'phone');
    expect(phoneError).toBeDefined();
  });

  it('should fail if address is not a string', async () => {
    const errors = await validateDto({ address: 123 as any });
    const addressError = errors.find((e) => e.property === 'address');
    expect(addressError).toBeDefined();
  });
});
