import { Injectable, Logger } from '@nestjs/common';
import { LangChainService } from '../ai/langChain.service';
import { aiAnswerSchema } from '../../schemas/langchain.schema';
import { EstimateService } from './estimate.service';
import { IComputer } from '../../interfaces/computer/computer.interface';
import { IHardware } from '../../interfaces/computer/hardware.interface';
import {
  IPartEstimate,
  IPartEstimateCreate,
} from '../../interfaces/estimate/part.interface';
import { IAIResponse } from '../../interfaces/ai/aiAnswer.interface';
import { ICurrency } from '../../interfaces/common.interface';
import { AIEstimateResponseDto } from '../../dtos/estimate/estimate.dto';
import { PromptService } from '../shop/prompt.service';
import { VectorStoreService } from '../ai/vectorStore.service';

@Injectable()
export class EstimateAIService {
  private readonly logger = new Logger(EstimateAIService.name);

  constructor(
    private readonly langChainService: LangChainService,
    private readonly estimateService: EstimateService,
    private readonly promptService: PromptService,
    private readonly vectorStoreService: VectorStoreService,
  ) {}

  async cacheEstimateStatus(response: AIEstimateResponseDto) {
    // Cache created status
    await this.estimateService.cacheEstimate(response);
  }

  async requestEstimate({
    shopId,
    currency,
    estimateId,
    computer,
  }: {
    estimateId: string;
    shopId: string;
    currency: ICurrency;
    computer: IComputer;
  }): Promise<IPartEstimate[]> {
    const { cpu, gpu, motherboard, rams, disks } = computer;
    const hardwareComponents: IHardware[] = [];

    if (cpu) hardwareComponents.push(cpu);
    // if (gpu) hardwareComponents.push(gpu);
    // if (motherboard) hardwareComponents.push(motherboard);
    // if (rams) hardwareComponents.push(...rams);
    // if (disks) hardwareComponents.push(...disks);

    const estimatePromises: Promise<IPartEstimate>[] = [];
    const cachedEstimates: IPartEstimate[] = [];

    // Fetch cached AI estimate parts.
    // If not found then create from AI
    for (const hardware of hardwareComponents) {
      const cachedEstimate = await this.estimateService.getCachedEstimatePart({
        shopId,
        hardware,
      });
      if (cachedEstimate) {
        cachedEstimates.push(cachedEstimate);
        continue;
      }
      estimatePromises.push(
        this._requestEstimateToAI({ shopId, estimateId, hardware, currency }),
      );
    }

    const aiResponsePromises = await Promise.allSettled(estimatePromises);
    const aiResponses = aiResponsePromises
      .filter((promise) => {
        if (promise.status === 'fulfilled') return promise;
        else this.logger.error(`AI RESPONSE ERROR`, promise.reason); // Todo: handle AI error
      })
      .map((p) => (p as PromiseFulfilledResult<IPartEstimate>).value);

    return [...cachedEstimates, ...aiResponses];
  }

  private async _requestEstimateToAI({
    shopId,
    hardware,
    currency,
    estimateId,
  }: Omit<IPartEstimateCreate, 'aiResponse'>): Promise<IPartEstimate> {
    const estimatePrompt = this.promptService.buildPrompt(
      // shopId,
      hardware,
    );
    const vectorStore = this.vectorStoreService.getVectorStore(hardware);

    return this.langChainService
      .chatToAI<IAIResponse>({
        estimatePrompt,
        vectorStore,
        responseSchema: aiAnswerSchema,
      })
      .then((aiAnswer) => {
        return this.estimateService.saveEstimatePart({
          shopId,
          hardware,
          currency,
          estimateId,
          aiResponse: aiAnswer,
        });
      });
  }
}
