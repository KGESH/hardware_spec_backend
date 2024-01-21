import { BusinessException } from './business.exception';
import { HttpStatus } from '@nestjs/common';
import { IBusinessExceptionExceptionArgs } from './exception.types';

export class RequiredArgsException<T> extends BusinessException<T> {
  constructor({ message, data }: IBusinessExceptionExceptionArgs<T>) {
    super({
      status: 'error',
      statusCode: HttpStatus.BAD_REQUEST,
      message,
      data,
    });
  }
}
