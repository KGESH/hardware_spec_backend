import { ExceptionFilter, Catch, ArgumentsHost, Logger } from '@nestjs/common';
import { Request, Response } from 'express';
import { BusinessException } from '../exceptions/business.exception';
import { ResponseDto } from '../dtos/response/response.dto';

@Catch(BusinessException)
export class BusinessExceptionFilter<T> implements ExceptionFilter {
  private readonly logger = new Logger(BusinessExceptionFilter.name);

  catch(exception: BusinessException<T>, host: ArgumentsHost) {
    this.logger.error('Exception', exception);

    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const statusCode = exception.getStatus();
    const exceptionResponse = exception.getResponse() as ResponseDto<T>;

    this.logger.debug(`Request Url`, request.url);
    this.logger.debug(`StatusCode`, statusCode);
    this.logger.debug(`Response`, exceptionResponse);

    response.status(statusCode).json(exceptionResponse);
  }
}
