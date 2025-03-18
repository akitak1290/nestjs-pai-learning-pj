import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
import { Response } from 'express';

@Catch(HttpException)
export class GlobalExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(GlobalExceptionFilter.name);

  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    const status = exception.getStatus();
    const responseData = exception.getResponse();

    const message =
      typeof responseData === 'string'
        ? responseData
        : (responseData as any).message || JSON.stringify(responseData);

    this.logger.error(`Exception caught: ${message} (Status: ${status})`);

    response.status(status).json({
      errorType: exception.constructor.name,
      statusCode: status,
      message,
    });
  }
}