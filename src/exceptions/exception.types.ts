import { IResponseError } from '../dtos/response/response.dto';

export type IBusinessExceptionBaseExceptionArgs<T> = IResponseError<T> & {
  statusCode: number;
};

export type IBusinessExceptionExceptionArgs<T> = Pick<
  IBusinessExceptionBaseExceptionArgs<T>,
  'message' | 'data'
>;
