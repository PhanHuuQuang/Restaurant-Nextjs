import 'reflect-metadata';
import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import { UpdateProductDto } from './update-product.dto';

describe('UpdateProductDto', () => {
  it('should pass validation with empty object (all optional)', async () => {
    const dto = plainToInstance(UpdateProductDto, {});
    const errors = await validate(dto);
    expect(errors.length).toBe(0);
  });

  it('should pass validation with partial fields', async () => {
    const dto = plainToInstance(UpdateProductDto, { title: 'New Title' });
    const errors = await validate(dto);
    expect(errors.length).toBe(0);
  });

  it('should pass validation with all fields', async () => {
    const dto = plainToInstance(UpdateProductDto, {
      title: 'Updated Pizza',
      desc: 'Updated description',
      img: '/new-img.png',
      price: 15.99,
      isFeatured: true,
      categoryId: 2,
      options: [{ title: 'Medium', additionalPrice: 2 }],
    });
    const errors = await validate(dto);
    expect(errors.length).toBe(0);
  });

  it('should fail when price is negative', async () => {
    const dto = plainToInstance(UpdateProductDto, { price: -10 });
    const errors = await validate(dto);
    expect(errors.some((e) => e.property === 'price')).toBe(true);
  });

  it('should fail when title is empty string', async () => {
    const dto = plainToInstance(UpdateProductDto, { title: '' });
    const errors = await validate(dto);
    expect(errors.some((e) => e.property === 'title')).toBe(true);
  });

  it('should fail when categoryId is not an integer', async () => {
    const dto = plainToInstance(UpdateProductDto, { categoryId: 1.5 });
    const errors = await validate(dto);
    expect(errors.some((e) => e.property === 'categoryId')).toBe(true);
  });
});
