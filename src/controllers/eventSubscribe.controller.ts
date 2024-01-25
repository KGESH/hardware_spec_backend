import { Controller, Logger } from '@nestjs/common';
import { EventPattern, Payload, Transport } from '@nestjs/microservices';
import { EstimateRequestDto } from '../dtos/estimate/estimate.dto';
import { EstimateAIService } from '../services/estimateAI.service';
import { ESTIMATE_CREATE_EVENT } from '../constants/estimate.constant';

@Controller()
export class EventSubscribeController {
  private readonly logger = new Logger(EventSubscribeController.name);

  constructor(private readonly estimateAIService: EstimateAIService) {}

  @EventPattern(ESTIMATE_CREATE_EVENT, Transport.REDIS)
  async requestEstimate(@Payload() data: EstimateRequestDto): Promise<any> {
    this.logger.debug('EventPattern EXTERNAL API REQUEST START', data);

    const estimate = await this.estimateAIService.requestEstimate(data);

    this.logger.debug('EventPattern EXTERNAL API REQUEST DONE', estimate);

    return { message: 'DONE' };
  }
}
