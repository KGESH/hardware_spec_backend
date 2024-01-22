import { Injectable, Logger } from '@nestjs/common';
import { LangChainService } from './langChain.service';
import { EstimatePredictDto } from '../dtos/estimate/estimate.dto';
import { AI_SAMPLE_PROMPT } from '../constants/ai.constants';

@Injectable()
export class EstimateAIService {
  private readonly logger = new Logger(EstimateAIService.name);

  constructor(private readonly langChainService: LangChainService) {}

  async requestEstimate(dto: EstimatePredictDto) {
    this.logger.debug(dto);
    return this.langChainService.chatToAI({
      systemInput: AI_SAMPLE_PROMPT,
      // userInput: `${dto.computer.cpu?.displayName}`,
      userInput: 'intel core i7 6600',
    });
  }
}
