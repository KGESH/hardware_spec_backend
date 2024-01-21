import { HttpException } from '@nestjs/common';
import { IBusinessExceptionBaseExceptionArgs } from './exception.types';

export class BusinessException<T> extends HttpException {
  constructor({
    statusCode,
    ...response
  }: IBusinessExceptionBaseExceptionArgs<T>) {
    super(response, statusCode);
  }
}
