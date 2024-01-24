import { Module } from '@nestjs/common';
import { EventSubscribeController } from '../controllers/eventSubscribe.controller';
import { EstimateModule } from './estimate.module';
import { EstimateAIService } from '../services/estimateAI.service';
import { LangChainModule } from './langChain.module';
import { RedisModule } from './redis.module';

@Module({
  imports: [RedisModule, EstimateModule, LangChainModule],
  controllers: [EventSubscribeController],
  providers: [EstimateAIService],
})
export class EventSubscribeModule {}
