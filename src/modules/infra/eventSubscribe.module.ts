import { Module } from '@nestjs/common';
import { EventSubscribeController } from '../../controllers/eventSubscribe.controller';
import { EstimateModule } from '../estimate/estimate.module';
import { RedisModule } from './redis.module';
import { ShopModule } from '../shop/shop.module';

@Module({
  imports: [RedisModule, EstimateModule, ShopModule],
  controllers: [EventSubscribeController],
})
export class EventSubscribeModule {}
