import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  MinLength,
  ValidateIf,
} from 'class-validator';
import { PHONE_PATTERN } from '../../shared/validation';

export class RegisterDto {
  @IsString() @IsNotEmpty() name: string;
  @IsEmail() email: string;
  @IsString() @MinLength(8) password: string;
  @IsOptional()
  @ValidateIf((o) => o.phone != null && o.phone !== '')
  @Matches(PHONE_PATTERN, {
    message: 'Phone must be a valid Vietnamese phone number',
  })
  phone?: string;
}
