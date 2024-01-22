import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { EstimateModule } from './modules/estimate.module';
import { RedisModule } from './modules/redis.module';
import { EventSubscribeModule } from './modules/eventSubscribe.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath:
        process.env.NODE_ENV === 'production' ? '.env.prod' : '.env.dev',
    }),
    RedisModule,
    EstimateModule,
    EventSubscribeModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
