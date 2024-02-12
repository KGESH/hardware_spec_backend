import { FactoryProvider } from '@nestjs/common';
import { EmbeddingsInterface } from '@langchain/core/embeddings';
import { ConfigsService } from '../../../configs/configs.service';
import {
  AI_EMBEDDINGS_MODEL,
  CPU_AMD_VECTOR_STORE,
  CPU_INTEL_VECTOR_STORE,
} from '../../../constants/ai.constants';
import { UnknownException } from '../../../exceptions/unknown.exception';
import { Pinecone } from '@pinecone-database/pinecone';
import { PineconeStore } from '@langchain/pinecone';
import { VectorStore } from '@langchain/core/vectorstores';

const intelCpuVectorStoreFactory: FactoryProvider = {
  inject: [ConfigsService, AI_EMBEDDINGS_MODEL],
  provide: CPU_INTEL_VECTOR_STORE,
  useFactory: (
    configService: ConfigsService,
    embeddings: EmbeddingsInterface,
  ): VectorStore => {
    try {
      const pc = new Pinecone({
        apiKey: configService.env.PINECONE_VECTOR_STORE_API_KEY,
      });
      const pineconeIndex = pc.Index(CPU_INTEL_VECTOR_STORE);
      return new PineconeStore(embeddings, {
        pineconeIndex,
      });
    } catch (e) {
      throw new UnknownException({
        e,
        message: 'Failed to initialize Intel CPU vector store',
      });
    }
  },
};

const amdCpuVectorStoreFactory: FactoryProvider = {
  inject: [ConfigsService, AI_EMBEDDINGS_MODEL],
  provide: CPU_AMD_VECTOR_STORE,
  useFactory: (
    configService: ConfigsService,
    embeddings: EmbeddingsInterface,
  ): VectorStore => {
    try {
      const pc = new Pinecone({
        apiKey: configService.env.PINECONE_VECTOR_STORE_API_KEY,
      });
      const pineconeIndex = pc.Index(CPU_AMD_VECTOR_STORE);
      return new PineconeStore(embeddings, {
        pineconeIndex,
      });
    } catch (e) {
      throw new UnknownException({
        e,
        message: 'Failed to initialize AMD CPU vector store',
      });
    }
  },
};

export const cpuVectorStoreProviders = [
  intelCpuVectorStoreFactory,
  amdCpuVectorStoreFactory,
];
