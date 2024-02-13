import { Test, TestingModule } from '@nestjs/testing';
import { ConfigsModule } from '../../../src/configs/configs.module';
import { EstimateModule } from '../../../src/modules/estimate/estimate.module';
import { LangChainService } from '../../../src/services/ai/langChain.service';
import { VectorStoreService } from '../../../src/services/ai/vectorStore.service';
import { ICpu } from '../../../src/interfaces/computer/cpu.interface';
import { MockCpuHelper } from '../../helpers/random/cpu.helper';
import { IEstimatePrompt } from '../../../src/interfaces/ai/prompt.interface';
import { IAIResponse } from '../../../src/interfaces/ai/aiAnswer.interface';
import { aiAnswerSchema } from '../../../src/schemas/langchain.schema';
import { PrismaService } from '../../../src/services/infra/prisma.service';
import { AI_PROMPT_SYSTEM_TEMPLATE } from '../../../src/constants/prompts/commonPrompt.constants';
import { AI_PROMPT_INTEL_CORE_SERIES_NORMALIZE_TEMPLATE } from '../../../src/constants/prompts/cpuPrompt.constants';
import { ConfigsService } from '../../../src/configs/configs.service';

describe('[Integration] AI CPU Intel Service', () => {
  let langChainService: LangChainService;
  let vectorStoreService: VectorStoreService;
  let prismaService: PrismaService;
  let configsService: ConfigsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [ConfigsModule, EstimateModule],
    }).compile();

    langChainService = module.get(LangChainService);
    vectorStoreService = module.get(VectorStoreService);
    prismaService = module.get(PrismaService);
    configsService = module.get(ConfigsService);
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
      const TEST_SHOP_ID = configsService.env.DEBUG_SHOP_ID;
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
      const intelVectorStore = await vectorStoreService.getVectorStore(cpu);

      // Normalize & Retrieve vector store
      const answer = await langChainService.chatToAI<IAIResponse>({
        estimatePrompt,
        shopId: TEST_SHOP_ID,
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
