import { Test, TestingModule } from '@nestjs/testing';
import { ConfigsModule } from '../../../src/configs/configs.module';
import { EstimateModule } from '../../../src/modules/estimate/estimate.module';
import { LangChainService } from '../../../src/services/ai/langChain.service';
import { VectorStoreService } from '../../../src/services/ai/vectorStore.service';
import { ICpu } from '../../../src/interfaces/computer/cpu.interface';
import { MockCpuHelper } from '../../helpers/random/cpu.helper';
import { IEstimatePrompt } from '../../../src/interfaces/ai/prompt.interface';
import {
  AI_PROMPT_INTEL_CORE_SERIES_NORMALIZE_TEMPLATE,
  AI_PROMPT_SYSTEM_TEMPLATE,
} from '../../../src/constants/prompt.constants';
import { IAIResponse } from '../../../src/interfaces/ai/aiAnswer.interface';
import { aiAnswerSchema } from '../../../src/schemas/langchain.schema';
import { PrismaService } from '../../../src/services/infra/prisma.service';

describe('[AI CPU Intel Service]', () => {
  let langChainService: LangChainService;
  let vectorStoreService: VectorStoreService;
  let prismaService: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [ConfigsModule, EstimateModule],
    }).compile();

    langChainService = module.get(LangChainService);
    vectorStoreService = module.get(VectorStoreService);
    prismaService = module.get(PrismaService);
  });

  afterEach(async () => {
    await prismaService.cleanDatabase();
  });

  describe('[Init]', () => {
    it('should be defined', () => {
      expect(langChainService).toBeDefined();
      expect(vectorStoreService).toBeDefined();
    });
  });

  describe('[Intel CPU]', () => {
    it('should be find Intel CPU price from AI', async () => {
      const cpu: ICpu = {
        ...MockCpuHelper.dto(),
        vendorName: 'intel',
        hwKey: 'Intel(R) Core(TM) i9-13900KS CPU @ 6.00GHz',
      };
      const estimatePrompt: IEstimatePrompt = {
        systemPromptTemplate: AI_PROMPT_SYSTEM_TEMPLATE(cpu.type),
        normalizePromptTemplate: AI_PROMPT_INTEL_CORE_SERIES_NORMALIZE_TEMPLATE,
        input: cpu.hwKey,
      };
      const intelVectorStore = vectorStoreService.getVectorStore(cpu);

      // Normalize & Retrieve vector store
      const answer = await langChainService.chatToAI<IAIResponse>({
        estimatePrompt,
        vectorStore: intelVectorStore,
        responseSchema: aiAnswerSchema,
      });

      expect(answer).toEqual({
        name: 'I9 13900KS',
        buyingPrice: 250000,
        tablePrice: 500000,
      });
    }, 120000);
  });
});
