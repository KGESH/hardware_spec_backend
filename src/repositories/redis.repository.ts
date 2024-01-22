import { IRedisRepository } from '../interfaces/redis.repository.interface';
import { Inject, Injectable, Logger, OnModuleDestroy } from '@nestjs/common';
import { Redis } from 'ioredis';
import { REDIS } from '../constants/redis.constant';
import { UnknownException } from '../exceptions/unknown.exception';

@Injectable()
export class RedisRepository implements IRedisRepository, OnModuleDestroy {
  private readonly logger = new Logger(RedisRepository.name);

  constructor(@Inject(REDIS) private readonly redis: Redis) {}

  onModuleDestroy(): void {
    this.redis.disconnect();
    this.logger.log('Redis connection closed.');
  }

  private _combinePrefix({
    prefix,
    key,
  }: {
    prefix: string;
    key: string;
  }): string {
    return `${prefix}:${key}`;
  }

  async get({
    prefix,
    key,
  }: {
    prefix: string;
    key: string;
  }): Promise<string | number | null> {
    try {
      return this.redis.get(this._combinePrefix({ prefix, key }));
    } catch (e) {
      throw new UnknownException(e, {
        message: 'redis get error',
        data: { prefix, key },
      });
    }
  }

  async set({
    prefix,
    key,
    value,
  }: {
    prefix: string;
    key: string;
    value: string | number;
  }): Promise<boolean> {
    try {
      const saved = await this.redis.set(
        this._combinePrefix({ prefix, key }),
        value,
      );

      return saved === 'OK';
    } catch (e) {
      throw new UnknownException(e, {
        message: 'redis set error',
        data: { prefix, key, value },
      });
    }
  }

  async delete({
    prefix,
    key,
  }: {
    prefix: string;
    key: string;
  }): Promise<void> {
    await this.redis.del(this._combinePrefix({ prefix, key }));
  }
  async setWithExpiry({
    prefix,
    key,
    value,
    expiry,
  }: {
    prefix: string;
    key: string;
    value: string | number;
    expiry: number;
  }): Promise<void> {
    await this.redis.set(
      this._combinePrefix({ prefix, key }),
      value,
      'EX',
      expiry,
    );
  }

  async getDeserialize<T>({
    prefix,
    key,
  }: {
    prefix: string;
    key: string;
  }): Promise<T | null> {
    try {
      const data = await this.redis.get(this._combinePrefix({ prefix, key }));

      if (!data) return null;

      return JSON.parse(data);
    } catch (e) {
      throw new UnknownException(e, {
        message: 'redis get deserialize error',
        data: { prefix, key },
      });
    }
  }
  async setSerialize<T>({
    prefix,
    key,
    value,
  }: {
    prefix: string;
    key: string;
    value: T;
  }): Promise<boolean> {
    try {
      const saved = await this.redis.set(
        this._combinePrefix({ prefix, key }),
        JSON.stringify(value),
      );
      return saved === 'OK';
    } catch (e) {
      throw new UnknownException(e, {
        message: 'redis set serialize error',
        data: { prefix, key, value },
      });
    }
  }
}
