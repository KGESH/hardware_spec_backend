import { Module } from '@nestjs/common';
import { CpuVectorStoreModule } from './vectorStores/cpuVectorStore.module';
import { VectorStoreService } from '../../services/ai/vectorStore.service';

@Module({
  imports: [CpuVectorStoreModule],
  providers: [VectorStoreService],
  exports: [CpuVectorStoreModule, VectorStoreService],
})
export class VectorStoreModule {}
