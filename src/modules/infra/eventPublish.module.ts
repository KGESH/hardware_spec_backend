import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';
import { REDIS_PUB } from '../../constants/redis.constant';
import { EventPublishService } from '../../services/infra/eventPublish.service';

@Module({
  imports: [
    ClientsModule.registerAsync([
      {
        inject: [ConfigService],
        name: REDIS_PUB,
        useFactory: (configService: ConfigService) => {
          return {
            transport: Transport.REDIS,
            options: {
              host: configService.get('REDIS_HOST'),
              port: +configService.get('REDIS_PORT'),
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
