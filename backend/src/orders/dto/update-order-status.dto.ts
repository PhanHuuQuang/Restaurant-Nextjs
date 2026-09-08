import { IsEnum, IsNotEmpty } from 'class-validator';
import { Status } from '../../../prisma/generated/prisma/client';

export class UpdateOrderStatusDto {
  @IsNotEmpty()
  @IsEnum(Status)
  status: Status;
}
