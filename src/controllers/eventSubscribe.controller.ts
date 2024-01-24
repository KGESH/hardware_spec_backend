import { Controller, Logger } from '@nestjs/common';
import { EventPattern, Payload, Transport } from '@nestjs/microservices';
import { EstimateRequestDto } from '../dtos/estimate/estimate.dto';
import { EstimateAIService } from '../services/estimateAI.service';

@Controller()
export class EventSubscribeController {
  private readonly logger = new Logger(EventSubscribeController.name);

  constructor(private readonly estimateAIService: EstimateAIService) {}

  @EventPattern('estimate', Transport.REDIS)
  async requestEstimate(@Payload() data: EstimateRequestDto): Promise<any> {
    this.logger.debug('EventPattern EXTERNAL API REQUEST START', data);

    const estimate = await this.estimateAIService.requestEstimate(data);

    this.logger.debug('EventPattern EXTERNAL API REQUEST DONE', estimate);

    return { message: 'DONE' };
  }
}
