import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { REDIS_PUB } from '../../constants/redis.constant';
import { EventPublishService } from '../../services/infra/eventPublish.service';
import { ConfigsService } from '../../configs/configs.service';

@Module({
  imports: [
    ClientsModule.registerAsync([
      {
        inject: [ConfigsService],
        name: REDIS_PUB,
        useFactory: (configService: ConfigsService) => {
          return {
            transport: Transport.REDIS,
            options: {
              host: configService.env.REDIS_HOST,
              port: +configService.env.REDIS_PORT,
            },
          };
        },
      },
    ]),
  ],
  providers: [EventPublishService],
  exports: [EventPublishService],
})
export class EventPublishModule {}
