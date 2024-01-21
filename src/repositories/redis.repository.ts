import { IRedisRepository } from '../interfaces/redis.repository.interface';
import { Inject, Injectable, Logger, OnModuleDestroy } from '@nestjs/common';
import { Redis } from 'ioredis';
import { REDIS_FACTORY } from '../constants/redis.constant';

@Injectable()
export class RedisRepository implements IRedisRepository, OnModuleDestroy {
  private readonly logger = new Logger(RedisRepository.name);

  constructor(@Inject(REDIS_FACTORY) private readonly redis: Redis) {}

  onModuleDestroy(): void {
    this.redis.disconnect();
    this.logger.log('Redis connection closed.');
  }

  async get({
    prefix,
    key,
  }: {
    prefix: string;
    key: string;
  }): Promise<string | number | null> {
    return this.redis.get(this._combinePrefix({ prefix, key }));
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
    const saved = await this.redis.set(
      this._combinePrefix({ prefix, key }),
      value,
    );

    return saved === 'OK';
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

  private _combinePrefix({
    prefix,
    key,
  }: {
    prefix: string;
    key: string;
  }): string {
    return `${prefix}:${key}`;
  }
}
