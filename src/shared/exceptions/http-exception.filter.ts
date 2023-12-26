import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();
    // @ts-ignore: Unreachable code error
    const errors = exception.getResponse().errors;
    const message = exception.message;

    response.status(status).json({
      code: status,
      path: request.url,
      errors: errors,
      message: message,
      timestamp: new Date().toISOString(),
    });
  }
}
