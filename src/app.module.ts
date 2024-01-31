import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { EstimateModule } from './modules/estimate/estimate.module';
import { RedisModule } from './modules/infra/redis.module';
import { EventSubscribeModule } from './modules/infra/eventSubscribe.module';
import { ShopModule } from './modules/shop/shop.module';
import { PricingTableModule } from './modules/shop/pricingTable.module';
import { CrawlingModule } from './modules/crawling/crawling.module';
import { ConfigsModule } from './configs/configs.module';

@Module({
  imports: [
    ConfigsModule,
    RedisModule,
    EstimateModule,
    EventSubscribeModule,
    PricingTableModule,
    ShopModule,
    CrawlingModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
