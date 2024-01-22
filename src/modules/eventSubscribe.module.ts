import { Module } from '@nestjs/common';
import { EventSubscribeController } from '../controllers/eventSubscribe.controller';
import { EstimateModule } from './estimate.module';
import { EstimateAIService } from '../services/estimateAI.service';
import { LangChainModule } from './langChain.module';

@Module({
  imports: [EstimateModule, LangChainModule],
  controllers: [EventSubscribeController],
  providers: [EstimateAIService],
})
export class EventSubscribeModule {}
