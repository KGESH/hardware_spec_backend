export type IRedisGetArgs = {
  prefix: string;
  key: string;
};

export type IRedisSetArgs<T> = {
  prefix: string;
  key: string;
  value: T;
  expiry?: number;
};

export type IRedisDeleteArgs = IRedisGetArgs;

export abstract class IRedisRepository {
  abstract get(args: IRedisGetArgs): Promise<string | number | null>;

  abstract set(args: IRedisSetArgs<string | number>): Promise<boolean>;

  abstract delete(args: IRedisDeleteArgs): Promise<void>;

  abstract getDeserialize<T>(args: IRedisGetArgs): Promise<T | null>;

  abstract setSerialize<T>(args: IRedisSetArgs<T>): Promise<boolean>;
}
