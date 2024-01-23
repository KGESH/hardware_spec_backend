import { Injectable, Logger } from '@nestjs/common';
import { LangChainService } from './langChain.service';
import { EstimatePredictDto } from '../dtos/estimate/estimate.dto';
import { AI_SAMPLE_PROMPT } from '../constants/ai.constants';
import { EstimateAIResponseDto } from '../dtos/estimate/ai.dto';
import { aiResponseSchema } from '../schemas/langchain.schema';

@Injectable()
export class EstimateAIService {
  private readonly logger = new Logger(EstimateAIService.name);

  constructor(private readonly langChainService: LangChainService) {}

  async requestEstimate(
    dto: EstimatePredictDto,
  ): Promise<EstimateAIResponseDto> {
    this.logger.debug(dto);
    return this.langChainService.chatToAI({
      systemInput: AI_SAMPLE_PROMPT,
      // userInput: `${dto.computer.cpu?.displayName}`,
      userInput: 'Intel core i9 12900',
      responseSchema: aiResponseSchema,
    });
  }
}
