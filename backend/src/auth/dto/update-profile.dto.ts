import { IsOptional, IsString, Matches, ValidateIf } from 'class-validator';
import { PHONE_PATTERN } from '../../shared/validation';

export class UpdateProfileDto {
  @IsOptional() @IsString() name?: string;
  @IsOptional()
  @ValidateIf((o) => o.phone != null && o.phone !== '')
  @Matches(PHONE_PATTERN, {
    message: 'Phone must be a valid Vietnamese phone number',
  })
  phone?: string;
  @IsOptional() @IsString() image?: string;
}
