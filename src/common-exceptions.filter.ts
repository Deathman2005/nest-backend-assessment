import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const res = ctx.getResponse<Response>();
    const req = ctx.getRequest<Request>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let response: any = {
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: req.url,
      message: 'Internal server error',
    };

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const exRes = exception.getResponse();
      response = {
        statusCode: status,
        timestamp: new Date().toISOString(),
        path: req.url,
        ...(typeof exRes === 'string' ? { message: exRes } : exRes),
      };
    } else if (exception instanceof Error) {
      // generic error
      response = {
        statusCode: status,
        timestamp: new Date().toISOString(),
        path: req.url,
        message: exception.message,
      };
    }

    this.logger.error(
      `HTTP ${status} - ${JSON.stringify(response)}`,
      (exception as any)?.stack,
    );
    res.status(status).json(response);
  }
}
