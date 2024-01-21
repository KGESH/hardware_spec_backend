import { Inject, Injectable } from '@nestjs/common';
import { IRedisRepository } from '../interfaces/redis.repository.interface';

@Injectable()
export class RedisService {
  constructor(
    @Inject(IRedisRepository)
    private readonly redisRepository: IRedisRepository,
  ) {}

  async get({
    prefix,
    key,
  }: {
    prefix: string;
    key: string;
  }): Promise<string | number | null> {
    return this.redisRepository.get({ prefix, key });
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
    return this.redisRepository.set({ prefix, key, value });
  }
}
