import { Module } from '@nestjs/common';
import { EventSubscribeController } from '../../controllers/eventSubscribe.controller';
import { EstimateModule } from '../estimate/estimate.module';
import { EstimateAIService } from '../../services/estimate/estimateAI.service';
import { RedisModule } from './redis.module';
import { ShopModule } from '../shop/shop.module';
import { PricingTableModule } from '../shop/pricingTable.module';

@Module({
  imports: [RedisModule, EstimateModule, PricingTableModule, ShopModule],
  controllers: [EventSubscribeController],
  providers: [EstimateAIService],
})
export class EventSubscribeModule {}
