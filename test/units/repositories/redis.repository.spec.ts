import { Test, TestingModule } from '@nestjs/testing';
import { ConfigModule } from '@nestjs/config';
import { redisFactory } from '../../../src/modules/redis.module';
import { IRedisRepository } from '../../../src/interfaces/redis.repository.interface';
import { v4 as uuidV4 } from 'uuid';
import { REDIS_FACTORY } from '../../../src/constants/redis.constant';
import { RedisRepository } from '../../../src/repositories/redis.repository';
import { Redis } from 'ioredis';

describe('[Spec] RedisRepository', () => {
  let redisRepository: RedisRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          envFilePath: '.env.test',
        }),
      ],
      providers: [
        redisFactory,
        {
          provide: IRedisRepository,
          inject: [REDIS_FACTORY],
          useFactory: (redis: Redis) => new RedisRepository(redis),
        },
      ],
    }).compile();

    redisRepository = module.get(IRedisRepository);
  });

  afterAll((done) => {
    // Closing the DB connection allows Jest to exit successfully.
    redisRepository.onModuleDestroy();
    done();
  });

  describe('[Init]', () => {
    it('should be defined', () => {
      expect(redisRepository).toBeDefined();
    });
  });

  describe('[get]', () => {
    it('[success] should be get null value', async () => {
      const prefix = uuidV4();
      const key = uuidV4();

      const result = await redisRepository.get({ prefix, key });

      expect(result).toBeNull();
    });
  });

  describe('[set]', () => {
    it('[success] should be set value', async () => {
      const prefix = uuidV4();
      const key = uuidV4();
      const value = uuidV4();

      const saved = await redisRepository.set({ prefix, key, value });
      expect(saved).toEqual(true);

      const savedValue = await redisRepository.get({ prefix, key });
      expect(value).toStrictEqual(savedValue);
    });
  });
});
