import {
  ArgumentsHost,
  BadRequestException,
  Catch,
  ConflictException,
  ExceptionFilter,
  HttpException,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { Response } from 'express';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/client';

@Catch(PrismaClientKnownRequestError)
export class PrismaExceptionFilter implements ExceptionFilter {
  catch(exception: PrismaClientKnownRequestError, host: ArgumentsHost) {
    const response = host.switchToHttp().getResponse<Response>();
    const httpException = this.mapToHttpException(exception);

    response
      .status(httpException.getStatus())
      .json(httpException.getResponse());
  }

  private mapToHttpException(
    exception: PrismaClientKnownRequestError,
  ): HttpException {
    switch (exception.code) {
      case 'P2002': {
        const target = exception.meta?.target;
        const fields = Array.isArray(target)
          ? target.join(', ')
          : (target as string | undefined);
        return new ConflictException(
          fields
            ? `Duplicate value for unique field(s): ${fields}`
            : 'A record with this value already exists',
        );
      }
      case 'P2025':
        return new NotFoundException(
          (exception.meta?.cause as string) ?? 'Record not found',
        );
      case 'P2003': {
        const target = exception.meta?.target as string | undefined;
        return new BadRequestException(
          target
            ? `Related record not found for field: ${target}`
            : 'Related record not found',
        );
      }
      default:
        return new InternalServerErrorException('Internal database error');
    }
  }
}
