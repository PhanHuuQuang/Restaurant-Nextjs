import 'reflect-metadata';
import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import { CreateProductDto } from './create-product.dto';

describe('CreateProductDto', () => {
  const validDto = {
    title: 'Margherita',
    price: 12.99,
    categoryId: 1,
  };

  it('should pass validation with required fields only', async () => {
    const dto = plainToInstance(CreateProductDto, validDto);
    const errors = await validate(dto);
    expect(errors.length).toBe(0);
  });

  it('should pass validation with all optional fields', async () => {
    const dto = plainToInstance(CreateProductDto, {
      ...validDto,
      desc: 'A classic pizza',
      img: '/img.png',
      isFeatured: true,
      options: [
        { title: 'Small', additionalPrice: 0 },
        { title: 'Large', additionalPrice: 4 },
      ],
    });
    const errors = await validate(dto);
    expect(errors.length).toBe(0);
  });

  it('should fail when title is missing', async () => {
    const dto = plainToInstance(CreateProductDto, { price: 12.99, categoryId: 1 });
    const errors = await validate(dto);
    expect(errors.some((e) => e.property === 'title')).toBe(true);
  });

  it('should fail when price is missing', async () => {
    const dto = plainToInstance(CreateProductDto, { title: 'Margherita', categoryId: 1 });
    const errors = await validate(dto);
    expect(errors.some((e) => e.property === 'price')).toBe(true);
  });

  it('should fail when categoryId is missing', async () => {
    const dto = plainToInstance(CreateProductDto, { title: 'Margherita', price: 12.99 });
    const errors = await validate(dto);
    expect(errors.some((e) => e.property === 'categoryId')).toBe(true);
  });

  it('should fail when price is negative', async () => {
    const dto = plainToInstance(CreateProductDto, {
      title: 'Margherita',
      price: -1,
      categoryId: 1,
    });
    const errors = await validate(dto);
    expect(errors.some((e) => e.property === 'price')).toBe(true);
  });

  it('should pass when price is zero', async () => {
    const dto = plainToInstance(CreateProductDto, {
      title: 'Free Item',
      price: 0,
      categoryId: 1,
    });
    const errors = await validate(dto);
    expect(errors.length).toBe(0);
  });

  it('should validate nested option additionalPrice minimum', async () => {
    const dto = plainToInstance(CreateProductDto, {
      ...validDto,
      options: [{ title: 'Small', additionalPrice: -5 }],
    });
    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
  });
});
