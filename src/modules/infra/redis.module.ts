import { FactoryProvider, Logger, Module } from '@nestjs/common';
import { Redis } from 'ioredis';
import { REDIS } from '../../constants/redis.constant';
import { RedisRepository } from '../../repositories/infra/redis.repository';
import { IRedisRepository } from '../../interfaces/infra/redis.repository.interface';
import { RedisService } from '../../services/infra/redis.service';
import { ConfigsService } from '../../configs/configs.service';

export const redisFactory: FactoryProvider = {
  inject: [ConfigsService],
  provide: REDIS,
  useFactory(configService: ConfigsService): Redis {
    const redis = new Redis({
      host: configService.env.REDIS_HOST,
      port: configService.env.REDIS_PORT,
    });

    redis.on('error', (error) => {
      Logger.error(`[${REDIS}] Redis connection failed`, error);
      throw new Error(`Redis connection failed: ${error}`);
    });

    return redis;
  },
};

@Module({
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
