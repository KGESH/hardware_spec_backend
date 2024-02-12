import { Module } from '@nestjs/common';
import { LangChainService } from '../../services/ai/langChain.service';
import { LearnService } from '../../services/ai/learn.service';
import { AiModelModule } from './models/aiModel.module';
import { VectorStoreModule } from './vectorStore.module';

@Module({
  imports: [AiModelModule, VectorStoreModule],
  providers: [LangChainService, LearnService],
  exports: [AiModelModule, VectorStoreModule, LangChainService, LearnService],
})
export class LangChainModule {}
