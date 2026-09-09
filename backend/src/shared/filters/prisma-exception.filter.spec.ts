import { ArgumentsHost, HttpStatus } from '@nestjs/common';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/client';
import { PrismaExceptionFilter } from './prisma-exception.filter';

describe('PrismaExceptionFilter', () => {
  let filter: PrismaExceptionFilter;
  let json: jest.Mock;
  let status: jest.Mock;

  const createHost = () =>
    ({
      switchToHttp: () => ({
        getResponse: () => ({ status }),
      }),
    }) as unknown as ArgumentsHost;

  const createError = (code: string, meta?: Record<string, unknown>) =>
    new PrismaClientKnownRequestError('prisma error', {
      code,
      clientVersion: '7.9.1',
      meta,
    });

  beforeEach(() => {
    filter = new PrismaExceptionFilter();
    json = jest.fn();
    status = jest.fn().mockReturnValue({ json });
  });

  it('maps P2002 to 409 Conflict with target fields', () => {
    filter.catch(createError('P2002', { target: ['slug'] }), createHost());

    expect(status).toHaveBeenCalledWith(HttpStatus.CONFLICT);
    expect(json).toHaveBeenCalledWith({
      statusCode: HttpStatus.CONFLICT,
      message: 'Duplicate value for unique field(s): slug',
      error: 'Conflict',
    });
  });

  it('maps P2002 to 409 with generic message when target missing', () => {
    filter.catch(createError('P2002'), createHost());

    expect(status).toHaveBeenCalledWith(HttpStatus.CONFLICT);
    expect(json).toHaveBeenCalledWith({
      statusCode: HttpStatus.CONFLICT,
      message: 'A record with this value already exists',
      error: 'Conflict',
    });
  });

  it('maps P2025 to 404 Not Found', () => {
    filter.catch(
      createError('P2025', { cause: 'Record to update not found.' }),
      createHost(),
    );

    expect(status).toHaveBeenCalledWith(HttpStatus.NOT_FOUND);
    expect(json).toHaveBeenCalledWith({
      statusCode: HttpStatus.NOT_FOUND,
      message: 'Record to update not found.',
      error: 'Not Found',
    });
  });

  it('maps P2003 to 400 Bad Request', () => {
    filter.catch(
      createError('P2003', { target: 'product_categoryId_fkey (index)' }),
      createHost(),
    );

    expect(status).toHaveBeenCalledWith(HttpStatus.BAD_REQUEST);
    expect(json).toHaveBeenCalledWith({
      statusCode: HttpStatus.BAD_REQUEST,
      message:
        'Related record not found for field: product_categoryId_fkey (index)',
      error: 'Bad Request',
    });
  });

  it('maps unknown codes to 500', () => {
    filter.catch(createError('P1001'), createHost());

    expect(status).toHaveBeenCalledWith(HttpStatus.INTERNAL_SERVER_ERROR);
    expect(json).toHaveBeenCalledWith({
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      message: 'Internal database error',
      error: 'Internal Server Error',
    });
  });
});
