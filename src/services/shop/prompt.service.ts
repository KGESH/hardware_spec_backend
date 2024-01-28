import { Injectable, Logger } from '@nestjs/common';
import { RedisService } from '../infra/redis.service';
import { REDIS_PROMPT_PREFIX } from '../../constants/redis.constant';
import { IPromptCache } from '../../interfaces/ai/prompt.interface';

@Injectable()
export class PromptService {
  private readonly logger = new Logger(PromptService.name);

  constructor(private readonly redisService: RedisService) {}

  async cachePrompt({ shopId, prompt }: IPromptCache): Promise<boolean> {
    return this.redisService.set({
      prefix: REDIS_PROMPT_PREFIX,
      key: shopId,
      value: prompt,
      expiry: 0,
    });
  }

  async getCachedPrompt(shopId: string): Promise<string | null> {
    return this.redisService.get<string>({
      prefix: REDIS_PROMPT_PREFIX,
      key: shopId,
    });
  }
}
