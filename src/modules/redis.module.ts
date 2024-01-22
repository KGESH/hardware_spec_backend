import { FactoryProvider, Logger, Module } from '@nestjs/common';
import { Redis } from 'ioredis';
import { REDIS } from '../constants/redis.constant';
import { ConfigService } from '@nestjs/config';
import { RedisRepository } from '../repositories/redis.repository';
import { IRedisRepository } from '../interfaces/redis.repository.interface';
import { RedisService } from '../services/redis.service';

export const redisFactory: FactoryProvider = {
  inject: [ConfigService],
  provide: REDIS,
  useFactory(configService: ConfigService): Redis {
    const redis = new Redis({
      host: configService.get('REDIS_HOST'),
      port: +configService.get('REDIS_PORT'),
    });

    redis.on('error', (error) => {
      Logger.error(`[${REDIS}] Redis connection failed`, error);
      throw new Error(`Redis connection failed: ${error}`);
    });

    return redis;
  },
};

@Module({
  imports: [],
  providers: [
    redisFactory,
    {
      provide: IRedisRepository,
      inject: [REDIS],
      useFactory: (redis: Redis) => new RedisRepository(redis),
    },
    RedisService,
  ],
  exports: [RedisService],
})
export class RedisModule {}
