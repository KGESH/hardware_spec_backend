import { Module } from '@nestjs/common';
import { EventSubscribeController } from '../controllers/eventSubscribe.controller';
import { EstimateModule } from './estimate.module';

@Module({
  imports: [EstimateModule],
  controllers: [EventSubscribeController],
})
export class EventSubscribeModule {}
