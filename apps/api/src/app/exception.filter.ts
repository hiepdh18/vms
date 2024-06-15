import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    // const request = ctx.getRequest<Request>();
    HttpExceptionFilter.handleResponse(response, exception);
  }

  private static handleResponse(response: Response, exception: any) {
    let responseBody: any = {
      code: HttpStatus.INTERNAL_SERVER_ERROR,
      message: 'Internal server error',
    };
    let statusCode = HttpStatus.INTERNAL_SERVER_ERROR;

    if (exception instanceof HttpException) {
      responseBody = exception.getResponse();
      statusCode = exception.getStatus();
    } else if (exception instanceof Error) {
      console.error(exception.stack);
    }
    response.status(statusCode).json(responseBody);
  }
}
