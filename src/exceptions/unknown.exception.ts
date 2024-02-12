import { BusinessException } from './business.exception';
import { HttpStatus, Logger } from '@nestjs/common';
import { IBusinessExceptionExceptionArgs } from './exception.types';

type UnknownExceptionArgs<T> = {
  e?: Error;
} & IBusinessExceptionExceptionArgs<T>;

export class UnknownException<T> extends BusinessException<T> {
  private readonly logger = new Logger(UnknownException.name);

  constructor({ e, message, data }: UnknownExceptionArgs<T>) {
    super({
      status: 'error',
      message,
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
    });

    // Only logging. Not response to client
    this.logger.error(e);
    this.logger.error(data);
  }
}
