import { Inject, Injectable, Logger } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { REDIS_PUB } from '../../constants/redis.constant';

@Injectable()
export class EventPublishService {
  private readonly logger = new Logger(EventPublishService.name);

  constructor(
    @Inject(REDIS_PUB)
    private readonly redisPub: ClientProxy,
  ) {}

  async emit(event: string, data: unknown): Promise<any> {
    this.logger.debug(`Emit event: ${event}`);
    return this.redisPub.emit(event, data);
  }
}
