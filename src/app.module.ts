import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { EstimateModule } from './modules/estimate/estimate.module';
import { RedisModule } from './modules/infra/redis.module';
import { EventSubscribeModule } from './modules/infra/eventSubscribe.module';
import { ShopModule } from './modules/shop/shop.module';
import { PricingTableModule } from './modules/shop/pricingTable.module';

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
    PricingTableModule,
    ShopModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
