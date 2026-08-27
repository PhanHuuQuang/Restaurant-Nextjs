import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import { UpdateCategoryDto } from './update-category.dto';

describe('UpdateCategoryDto', () => {
  it('should pass validation with empty object (all optional)', async () => {
    const dto = plainToInstance(UpdateCategoryDto, {});
    const errors = await validate(dto);
    expect(errors.length).toBe(0);
  });

  it('should pass validation with partial fields', async () => {
    const dto = plainToInstance(UpdateCategoryDto, { title: 'New Title' });
    const errors = await validate(dto);
    expect(errors.length).toBe(0);
  });

  it('should pass validation with all fields', async () => {
    const dto = plainToInstance(UpdateCategoryDto, {
      slug: 'new-slug',
      title: 'New Title',
      description: 'New description',
      image: '/new-img.png',
      color: 'red',
    });
    const errors = await validate(dto);
    expect(errors.length).toBe(0);
  });

  it('should fail when slug is not a string', async () => {
    const dto = plainToInstance(UpdateCategoryDto, { slug: 123 });
    const errors = await validate(dto);
    expect(errors.some((e) => e.property === 'slug')).toBe(true);
  });

  it('should fail when title is not a string', async () => {
    const dto = plainToInstance(UpdateCategoryDto, { title: 123 });
    const errors = await validate(dto);
    expect(errors.some((e) => e.property === 'title')).toBe(true);
  });
});
