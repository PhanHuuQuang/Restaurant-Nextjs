import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import { CreateCategoryDto } from './create-category.dto';

describe('CreateCategoryDto', () => {
  const validDto = {
    slug: 'pizzas',
    title: 'Cheesy Pizzas',
  };

  it('should pass validation with required fields only', async () => {
    const dto = plainToInstance(CreateCategoryDto, validDto);
    const errors = await validate(dto);
    expect(errors.length).toBe(0);
  });

  it('should pass validation with all optional fields', async () => {
    const dto = plainToInstance(CreateCategoryDto, {
      ...validDto,
      description: 'A delicious category',
      image: '/img.png',
      color: 'white',
    });
    const errors = await validate(dto);
    expect(errors.length).toBe(0);
  });

  it('should fail when slug is missing', async () => {
    const dto = plainToInstance(CreateCategoryDto, { title: 'Title' });
    const errors = await validate(dto);
    expect(errors.some((e) => e.property === 'slug')).toBe(true);
  });

  it('should fail when title is missing', async () => {
    const dto = plainToInstance(CreateCategoryDto, { slug: 'pizzas' });
    const errors = await validate(dto);
    expect(errors.some((e) => e.property === 'title')).toBe(true);
  });

  it('should fail when slug is not a string', async () => {
    const dto = plainToInstance(CreateCategoryDto, {
      slug: 123,
      title: 'Title',
    });
    const errors = await validate(dto);
    expect(errors.some((e) => e.property === 'slug')).toBe(true);
  });

  it('should fail when title is empty string', async () => {
    const dto = plainToInstance(CreateCategoryDto, {
      slug: 'pizzas',
      title: '',
    });
    const errors = await validate(dto);
    expect(errors.some((e) => e.property === 'title')).toBe(true);
  });
});
