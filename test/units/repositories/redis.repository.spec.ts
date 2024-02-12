import { Test, TestingModule } from '@nestjs/testing';
import { redisFactory } from '../../../src/modules/infra/redis.module';
import { IRedisRepository } from '../../../src/interfaces/infra/redis.repository.interface';
import { v4 as uuidV4 } from 'uuid';
import { REDIS } from '../../../src/constants/redis.constant';
import { RedisRepository } from '../../../src/repositories/infra/redis.repository';
import { Redis } from 'ioredis';
import { ConfigsModule } from '../../../src/configs/configs.module';

describe('[Spec] RedisRepository', () => {
  let redisRepository: RedisRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [ConfigsModule],
      providers: [
        redisFactory,
        {
          provide: IRedisRepository,
          inject: [REDIS],
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
