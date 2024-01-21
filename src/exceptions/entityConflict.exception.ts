import { BusinessException } from './business.exception';
import { IBusinessExceptionExceptionArgs } from './exception.types';
import { HttpStatus } from '@nestjs/common';

export class EntityConflictException<T> extends BusinessException<T> {
  constructor({ message, data }: IBusinessExceptionExceptionArgs<T>) {
    super({
      status: 'error',
      statusCode: HttpStatus.CONFLICT,
      message,
      data,
    });
  }
}
