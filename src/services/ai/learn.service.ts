import { Inject, Injectable, Logger } from '@nestjs/common';
import {
  CPU_AMD_VECTOR_STORE,
  CPU_INTEL_VECTOR_STORE,
} from '../../constants/ai.constants';
import { CheerioWebBaseLoader } from 'langchain/document_loaders/web/cheerio';
import { Document } from 'langchain/document';
import { CSVLoader } from 'langchain/document_loaders/fs/csv';
import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter';
import { VectorStore } from '@langchain/core/vectorstores';

import { IDatasetEmbeddings } from '../../interfaces/ai/embeddings.interface';
import { VectorStoreService } from './vectorStore.service';

@Injectable()
export class LearnService {
  private readonly logger = new Logger(LearnService.name);

  constructor(
    // @Inject(CPU_INTEL_VECTOR_STORE)
    // private readonly intelCpuVectorStore: VectorStore,
    // @Inject(CPU_AMD_VECTOR_STORE)
    // private readonly amdCpuVectorStore: VectorStore,
    private readonly vectorStoreService: VectorStoreService,
  ) {}

  async intelEmbeddings() {
    const urls = [
      'https://www.worldmemory.co.kr/price/computer.do?ctgry_no1=8&ctgry_no2=9&ctgry_no3=4144',
      'https://www.worldmemory.co.kr/price/computer.do?ctgry_no1=8&ctgry_no2=9&ctgry_no3=4137',
      'https://www.worldmemory.co.kr/price/computer.do?ctgry_no1=8&ctgry_no2=9&ctgry_no3=4089',
      'https://www.worldmemory.co.kr/price/computer.do?ctgry_no1=8&ctgry_no2=9&ctgry_no3=4083',
      'https://www.worldmemory.co.kr/price/computer.do?ctgry_no1=8&ctgry_no2=9&ctgry_no3=4020',
      'https://www.worldmemory.co.kr/price/computer.do?ctgry_no1=8&ctgry_no2=9&ctgry_no3=25',
      'https://www.worldmemory.co.kr/price/computer.do?ctgry_no1=8&ctgry_no2=9&ctgry_no3=3918',
      'https://www.worldmemory.co.kr/price/computer.do?ctgry_no1=8&ctgry_no2=9&ctgry_no3=3838',
      'https://www.worldmemory.co.kr/price/computer.do?ctgry_no1=8&ctgry_no2=9&ctgry_no3=3682',
      'https://www.worldmemory.co.kr/price/computer.do?ctgry_no1=8&ctgry_no2=8&ctgry_no3=3681',
      'https://www.worldmemory.co.kr/price/computer.do?ctgry_no1=8&ctgry_no2=8&ctgry_no3=1684',
      'https://www.worldmemory.co.kr/price/computer.do?ctgry_no1=8&ctgry_no2=8&ctgry_no3=1188',
      'https://www.worldmemory.co.kr/price/computer.do?ctgry_no1=8&ctgry_no2=8&ctgry_no3=993',
      'https://www.worldmemory.co.kr/price/computer.do?ctgry_no1=7&ctgry_no2=8&ctgry_no3=31',
      'https://www.worldmemory.co.kr/price/computer.do?ctgry_no1=7&ctgry_no2=8&ctgry_no3=3652',
      'https://www.worldmemory.co.kr/price/computer.do?ctgry_no1=7&ctgry_no2=8&ctgry_no3=3584',
      'https://www.worldmemory.co.kr/price/computer.do?ctgry_no1=7&ctgry_no2=8&ctgry_no3=3583',
    ];

    const vectorStore = await this.vectorStoreService.getVectorStore({
      type: 'CPU',
      vendorName: 'intel',
    });
    const docs: Document[] = await this.fetchDocsFromWeb({
      vendor: 'intel',
      shopId: '', // Todo: impl
      urls,
    });
    const batches: Document[][] = [];
    for (let i = 0; i < docs.length; i += 100) {
      batches.push(docs.slice(i, Math.min(i + 100, docs.length)));
    }

    for (const batch of batches) {
      try {
        this.logger.debug(`Adding document to vector store...`);
        await vectorStore.addDocuments(batch);
        await new Promise((resolve) => setTimeout(resolve, 1000)); // delay 1 sec
      } catch (e) {
        this.logger.error(`Failed to add documents to vector store.`, e);
      }
    }

    return docs;
  }

  async amdEmbeddings() {
    const urls = [
      'https://www.worldmemory.co.kr/price/computer.do?ctgry_no1=8&ctgry_no2=24&ctgry_no3=4138',
      'https://www.worldmemory.co.kr/price/computer.do?ctgry_no1=8&ctgry_no2=24&ctgry_no3=4072',
      'https://www.worldmemory.co.kr/price/computer.do?ctgry_no1=8&ctgry_no2=24&ctgry_no3=30',
      'https://www.worldmemory.co.kr/price/computer.do?ctgry_no1=8&ctgry_no2=24&ctgry_no3=3945',
      'https://www.worldmemory.co.kr/price/computer.do?ctgry_no1=8&ctgry_no2=24&ctgry_no3=3943',
      'https://www.worldmemory.co.kr/price/computer.do?ctgry_no1=8&ctgry_no2=24&ctgry_no3=1792',
      'https://www.worldmemory.co.kr/price/computer.do?ctgry_no1=8&ctgry_no2=24&ctgry_no3=1236',
      'https://www.worldmemory.co.kr/price/computer.do?ctgry_no1=8&ctgry_no2=24&ctgry_no3=1012',
      'https://www.worldmemory.co.kr/price/computer.do?ctgry_no1=8&ctgry_no2=24&ctgry_no3=1235',
      'https://www.worldmemory.co.kr/price/computer.do?ctgry_no1=8&ctgry_no2=24&ctgry_no3=29',
    ];

    const vectorStore = await this.vectorStoreService.getVectorStore({
      type: 'CPU',
      vendorName: 'intel',
    });
    const docs = await this.fetchDocsFromWeb({
      vendor: 'amd',
      shopId: '', // Todo: impl
      urls,
    });

    const batches: Document[][] = [];
    for (let i = 0; i < docs.length; i += 100) {
      batches.push(docs.slice(i, Math.min(i + 100, docs.length)));
    }

    for (const batch of batches) {
      try {
        this.logger.debug(`Adding document to vector store...`);
        // this.amdCpuVectorStore.addVectors(batch);
        await vectorStore.addDocuments(batch);
        await new Promise((resolve) => setTimeout(resolve, 1000)); // delay 1 sec
      } catch (e) {
        this.logger.error(`Failed to add documents to vector store.`, e);
      }
    }

    return docs;
  }

  async embeddingsFromCsv(path: string, vectorStore: VectorStore) {
    const dataset = new CSVLoader(path);
    const csvDocs = await dataset.load();
    this.logger.verbose(`Loaded datasets ${csvDocs.length}...`);

    const batches: Document[][] = [];
    for (let i = 0; i < csvDocs.length; i += 100) {
      batches.push(csvDocs.slice(i, Math.min(i + 100, csvDocs.length)));
    }

    for (const batch of batches) {
      try {
        this.logger.debug(`Adding document to vector store...`);
        await vectorStore.addDocuments(batch);
        await new Promise((resolve) => setTimeout(resolve, 1000)); // delay 1 sec
      } catch (e) {
        this.logger.error(`Failed to add documents to vector store.`, e);
      }
    }
  }

  async fetchDocsFromWeb({ vendor, urls, shopId }: IDatasetEmbeddings) {
    const docsPromises = urls.map((url) =>
      new CheerioWebBaseLoader(url, { selector: 'tbody' }).load(),
    );

    const splitter = new RecursiveCharacterTextSplitter({
      chunkSize: 40,
      chunkOverlap: 10,
    });

    const docs = await Promise.all(docsPromises);
    const savedDocs: Document[][] = [];

    // Todo: add batch

    try {
      for (const doc of docs) {
        const replacedDoc: Document[] = doc.map((d) => {
          const cleanedPageContent = d.pageContent
            .replace(/\t/g, '')
            .replace(
              /[\uAC00-\uD7A3]+(I\d+\s?\d+K?|G\d+\s?\d*|Q\d+\s?\d+|E\d+\s?\d+)/gi,
              '$1',
            )
            .replace(/(\d+)\s*원/g, '$1') // Replace "원" globally when it follows a number
            .replace(/,/g, '');

          return {
            pageContent: cleanedPageContent,
            metadata: {
              ...d.metadata,
              docType: 'estimate_pricing_table',
              vendor,
              shopId,
            },
          };
        });

        const splitDocs = await splitter.splitDocuments(replacedDoc);
        savedDocs.push(splitDocs);
      }
    } catch (e) {
      this.logger.error(`Failed to add AMD documents to vector store.`, e);
    }
    return savedDocs.flat();
  }
}
