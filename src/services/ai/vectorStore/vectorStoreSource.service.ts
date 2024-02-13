import { Inject, Injectable, Logger } from '@nestjs/common';
import { AI_VECTOR_STORE_SOURCE_CLIENT } from '../../../constants/ai.constants';
import { Pinecone } from '@pinecone-database/pinecone';
import { UnknownException } from '../../../exceptions/unknown.exception';
import { isProduction } from '../../../utils/production.util';

@Injectable()
export class VectorStoreSourceService {
  private readonly logger = new Logger(VectorStoreSourceService.name);

  constructor(
    @Inject(AI_VECTOR_STORE_SOURCE_CLIENT)
    private readonly pinecone: Pinecone,
  ) {}

  async getOrCreateIndex(indexName: string) {
    const { indexes } = await this.pinecone.listIndexes();

    const existIndex = indexes?.find((index) => index.name === indexName);
    if (existIndex) return this.pinecone.Index(indexName);

    try {
      const createdIndex = await this.pinecone.createIndex({
        name: indexName,
        dimension: 768,
        metric: 'cosine',
        spec: {
          serverless: {
            cloud: 'aws',
            region: 'us-west-2',
          },
        },
      });
      if (createdIndex) return this.pinecone.Index(indexName);
    } catch (e) {
      throw new UnknownException({
        e,
        message: `Failed to create index: ${indexName}`,
      });
    }

    // Todo: assert
    // Index not created. Check Pinecone status
    throw new UnknownException({
      message: `Failed to create index: ${indexName}`,
    });
  }

  async dropIndexes(): Promise<void> {
    if (isProduction()) return;

    try {
      const { indexes } = await this.pinecone.listIndexes();

      const deletePromises: Promise<void>[] =
        indexes?.map((index) => this.pinecone.deleteIndex(index.name)) ?? [];

      const deleteResults = await Promise.allSettled(deletePromises);
      deleteResults.forEach((result) => {
        if (result.status === 'rejected') this.logger.error(result.reason);
      });
    } catch (e) {
      throw new UnknownException({ e, message: 'Failed to reset indexes' });
    }
  }

  async deleteIndex(indexName: string): Promise<void> {
    try {
      await this.pinecone.deleteIndex(indexName);
    } catch (e) {
      this.logger.error(e);
    }
  }
}
