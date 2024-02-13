import { FactoryProvider, Inject, Injectable } from '@nestjs/common';
import { ConfigsService } from '../../../configs/configs.service';
import { AI_VECTOR_STORE_SOURCE_CLIENT } from '../../../constants/ai.constants';
import { Index, Pinecone } from '@pinecone-database/pinecone';
import { UnknownException } from '../../../exceptions/unknown.exception';

export const vectorStoreSourceFactory: FactoryProvider = {
  inject: [ConfigsService],
  provide: AI_VECTOR_STORE_SOURCE_CLIENT,
  useFactory: (configService: ConfigsService): Pinecone => {
    try {
      return new Pinecone({
        apiKey: configService.env.PINECONE_VECTOR_STORE_API_KEY,
      });
    } catch (e) {
      throw new UnknownException({
        e,
        message: 'Failed to initialize Intel CPU vector store',
      });
    }
  },
};

@Injectable()
export class PineconeService {
  constructor(
    @Inject(AI_VECTOR_STORE_SOURCE_CLIENT)
    private readonly pinecone: Pinecone,
  ) {}

  getPineconeClient(): Pinecone {
    return this.pinecone;
  }

  async getOrCreateIndex(indexName: string): Promise<Index> {
    const { indexes } = await this.pinecone.listIndexes();

    const existIndex = indexes?.find((index) => index.name === indexName);
    if (existIndex) return this.pinecone.Index(indexName);

    const createdIndex = await this.pinecone.createIndex({
      name: indexName,
      dimension: 768,
      metric: 'cosine',
      spec: {
        serverless: {
          cloud: 'aws',
          region: 'ap-northeast-1',
        },
      },
    });
    if (createdIndex) return this.pinecone.Index(indexName);

    // Index not created. Check Pinecone status
    throw new UnknownException({
      message: `Failed to create index: ${indexName}`,
    });
  }
}
