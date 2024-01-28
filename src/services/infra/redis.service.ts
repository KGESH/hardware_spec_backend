import { Inject, Injectable } from '@nestjs/common';
import {
  IRedisGetArgs,
  IRedisRepository,
  IRedisSetArgs,
} from '../../interfaces/infra/redis.repository.interface';

@Injectable()
export class RedisService {
  constructor(
    @Inject(IRedisRepository)
    private readonly redisRepository: IRedisRepository,
  ) {}

  async get<T>(args: IRedisGetArgs): Promise<T | null> {
    return (await this.redisRepository.get(args)) as T;
  }

  async set(args: IRedisSetArgs<string | number>): Promise<boolean> {
    return this.redisRepository.set(args);
  }

  async getDeserialize<T>(args: IRedisGetArgs): Promise<T | null> {
    return this.redisRepository.getDeserialize<T>(args);
  }

  async setSerialize<T>(args: IRedisSetArgs<T>): Promise<boolean> {
    return this.redisRepository.setSerialize<T>(args);
  }
}
