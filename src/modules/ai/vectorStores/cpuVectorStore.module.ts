import { Module } from '@nestjs/common';
import { CpuVectorStoreService } from '../../../services/ai/vectorStore/cpuVectorStore.service';
import { aiEmbeddingsModelProviders } from '../models/aiEmbeddingsModel.factory';
import { vectorStoreSourceFactory } from './vectorStoreSource.factory';
import { VectorStoreSourceService } from '../../../services/ai/vectorStore/vectorStoreSource.service';

@Module({
  providers: [
    ...aiEmbeddingsModelProviders,
    vectorStoreSourceFactory,
    VectorStoreSourceService,
    CpuVectorStoreService,
  ],
  exports: [
    ...aiEmbeddingsModelProviders,
    vectorStoreSourceFactory,
    VectorStoreSourceService,
    CpuVectorStoreService,
  ],
})
export class CpuVectorStoreModule {}
