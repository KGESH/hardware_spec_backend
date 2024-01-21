export abstract class IRedisRepository {
  abstract get({
    prefix,
    key,
  }: {
    prefix: string;
    key: string;
  }): Promise<string | number | null>;

  abstract set({
    prefix,
    key,
    value,
  }: {
    prefix: string;
    key: string;
    value: string | number;
  }): Promise<boolean>;

  abstract delete({
    prefix,
    key,
  }: {
    prefix: string;
    key: string;
  }): Promise<void>;

  abstract setWithExpiry({
    prefix,
    key,
    value,
    expiry,
  }: {
    prefix: string;
    key: string;
    value: string | number;
    expiry: number;
  }): Promise<void>;
}
