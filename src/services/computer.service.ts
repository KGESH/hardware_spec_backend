import { Injectable, Logger } from '@nestjs/common';
import {
  ComputerDto,
  SystemInfoDto,
  SystemInfoQuery,
} from '../dtos/computer/computer.dto';
import { RedisService } from './redis.service';
import { REDIS_SYSTEM_INFO_PREFIX } from '../constants/redis.constant';

@Injectable()
export class ComputerService {
  private readonly logger = new Logger(ComputerService.name);

  constructor(private readonly redisService: RedisService) {}

  async cacheComputerSpec(
    encodedId: string,
    dto: ComputerDto,
  ): Promise<string> {
    await this.redisService.setSerialize({
      prefix: REDIS_SYSTEM_INFO_PREFIX,
      key: encodedId,
      value: dto,
    });

    return encodedId;
  }

  async getCachedComputerSpec(encodedId: string): Promise<ComputerDto | null> {
    return await this.redisService.getDeserialize<ComputerDto>({
      prefix: REDIS_SYSTEM_INFO_PREFIX,
      key: encodedId,
    });
  }

  async getSystemInfo(query: SystemInfoQuery): Promise<SystemInfoDto | null> {
    const computerSpec = await this.getCachedComputerSpec(query.encodedId);

    // Todo: fetch DB

    if (!computerSpec) return null;

    return {
      encodedId: query.encodedId,
      computer: computerSpec,
    };
  }
}
