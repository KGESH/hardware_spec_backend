import { Injectable, Logger } from '@nestjs/common';
import { LangChainService } from './langChain.service';
import { EstimateRequestDto } from '../dtos/estimate/estimate.dto';
import { AI_SAMPLE_SYSTEM_PROMPT } from '../constants/ai.constants';
import {
  EstimateAIAnswerPendingDto,
  EstimateAIAnswerSuccessDto,
} from '../dtos/estimate/ai.dto';
import { aiAnswerSchema } from '../schemas/langchain.schema';
import { EstimateService } from './estimate.service';

@Injectable()
export class EstimateAIService {
  private readonly logger = new Logger(EstimateAIService.name);

  constructor(
    private readonly langChainService: LangChainService,
    private readonly estimateService: EstimateService,
  ) {}

  async requestEstimate(
    dto: EstimateRequestDto,
  ): Promise<EstimateAIAnswerSuccessDto> {
    this.logger.debug(dto);
    const pending: EstimateAIAnswerPendingDto = {
      status: 'pending',
    };

    // Cache created status
    await this.estimateService.cacheEstimate(dto.encodedId, pending);

    // Todo: replace query
    const aiResponse = await this.langChainService.chatToAI({
      systemInput: AI_SAMPLE_SYSTEM_PROMPT,
      // query: `${dto.computer.cpu?.displayName}`,
      query: 'Intel core i9 12900',
      responseSchema: aiAnswerSchema,
    });

    const done: EstimateAIAnswerSuccessDto = {
      status: 'success',
      estimate: aiResponse,
    };

    await this.estimateService.cacheEstimate(dto.encodedId, done);

    return done;
  }
}
