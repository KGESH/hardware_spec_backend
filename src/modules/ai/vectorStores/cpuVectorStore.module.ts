import { Module } from '@nestjs/common';
import { cpuVectorStoreProviders } from './cpuVectorStore.factory';
import { CpuVectorStoreService } from '../../../services/ai/vectorStore/cpuVectorStore.service';
import { aiEmbeddingsModelProviders } from '../models/aiEmbeddingsModel.factory';

@Module({
  providers: [
    ...aiEmbeddingsModelProviders,
    ...cpuVectorStoreProviders,
    CpuVectorStoreService,
  ],
  exports: [
    ...cpuVectorStoreProviders,
    ...aiEmbeddingsModelProviders,
    CpuVectorStoreService,
  ],
})
export class CpuVectorStoreModule {}
