import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
} from '@nestjs/common';
import type { Request, Response } from 'express';
import { Prisma } from 'src/generated/prisma/client';
import { PRISMA_ERROR_MESSAGES } from '../constants/prisma-error-messages';
import { getUniqueConstraintMessage } from '../utils/prisma-error.utils';

@Catch(Prisma.PrismaClientKnownRequestError)
export class PrismaExceptionFilter implements ExceptionFilter {
  catch(exception: Prisma.PrismaClientKnownRequestError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const { statusCode, message } = this.mapPrismaError(exception);

    response.status(statusCode).json({
      statusCode,
      message,
      error: this.getErrorName(statusCode),
      timestamp: new Date().toISOString(),
      path: request.url,
    });
  }

  private mapPrismaError(exception: Prisma.PrismaClientKnownRequestError): {
    statusCode: number;
    message: string;
  } {
    switch (exception.code) {
      case 'P2002':
        return {
          statusCode: HttpStatus.CONFLICT,
          message: getUniqueConstraintMessage(
            exception.meta?.target,
            exception.message,
          ),
        };
      case 'P2025':
        return {
          statusCode: HttpStatus.NOT_FOUND,
          message: PRISMA_ERROR_MESSAGES.P2025,
        };
      case 'P2003':
        return {
          statusCode: HttpStatus.CONFLICT,
          message: PRISMA_ERROR_MESSAGES.P2003,
        };
      case 'P2014':
        return {
          statusCode: HttpStatus.CONFLICT,
          message: PRISMA_ERROR_MESSAGES.P2014,
        };
      default:
        return {
          statusCode: HttpStatus.BAD_REQUEST,
          message: PRISMA_ERROR_MESSAGES.DEFAULT,
        };
    }
  }

  private getErrorName(statusCode: number): string {
    if (statusCode === 409) return 'Conflict';
    if (statusCode === 404) return 'Not Found';
    return 'Bad Request';
  }
}
