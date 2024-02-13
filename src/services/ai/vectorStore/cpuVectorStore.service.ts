import { Inject, Injectable, Logger } from '@nestjs/common';
import {
  AI_EMBEDDINGS_MODEL,
  CPU_AMD_VECTOR_STORE,
  CPU_INTEL_VECTOR_STORE,
} from '../../../constants/ai.constants';
import { VectorStore } from '@langchain/core/vectorstores';
import { ICpu } from '../../../interfaces/computer/cpu.interface';
import { UnknownException } from '../../../exceptions/unknown.exception';
import { checkCpuVendor } from '../../../utils/brand/cpu/commonCpu.util';
import { EmbeddingsInterface } from '@langchain/core/embeddings';
import { VectorStoreSourceService } from './vectorStoreSource.service';
import { PineconeStore } from '@langchain/pinecone';

@Injectable()
export class CpuVectorStoreService {
  private readonly logger = new Logger(CpuVectorStoreService.name);

  constructor(
    @Inject(AI_EMBEDDINGS_MODEL)
    private readonly embeddings: EmbeddingsInterface,
    private readonly vectorStoreSourceService: VectorStoreSourceService,
  ) {}

  getCpuVectorStore(cpu: Pick<ICpu, 'vendorName'>): Promise<VectorStore> {
    const vendor = checkCpuVendor(cpu.vendorName);
    switch (vendor) {
      case 'intel':
        return this.getVectorStore(CPU_INTEL_VECTOR_STORE);
      case 'amd':
        return this.getVectorStore(CPU_AMD_VECTOR_STORE);
      default:
        throw new UnknownException({
          message: `Unknown CPU vendor: ${vendor}`,
        });
    }
  }

  async getVectorStore(indexName: string): Promise<PineconeStore> {
    try {
      const pineconeIndex =
        await this.vectorStoreSourceService.getOrCreateIndex(indexName);

      return new PineconeStore(this.embeddings, {
        pineconeIndex,
      });
    } catch (e) {
      throw new UnknownException({
        e,
        message: 'Failed to initialize Intel CPU vector store',
      });
    }
  }
}
