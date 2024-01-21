import { BusinessException } from './business.exception';
import { HttpStatus } from '@nestjs/common';
import { IBusinessExceptionExceptionArgs } from './exception.types';

export class EntityNotfoundException<T> extends BusinessException<T> {
  constructor({ message, data }: IBusinessExceptionExceptionArgs<T>) {
    super({
      status: 'not_found',
      statusCode: HttpStatus.NOT_FOUND,
      message,
      data,
    });
  }
}
