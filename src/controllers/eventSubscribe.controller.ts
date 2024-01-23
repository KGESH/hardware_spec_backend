import { Controller, Logger } from '@nestjs/common';
import { EventPattern, Payload, Transport } from '@nestjs/microservices';
import { EstimatePredictDto } from '../dtos/estimate/estimate.dto';
import { EstimateService } from '../services/estimate.service';
import { EstimateAIService } from '../services/estimateAI.service';

@Controller()
export class EventSubscribeController {
  private readonly logger = new Logger(EventSubscribeController.name);

  constructor(
    private readonly estimateService: EstimateService,
    private readonly estimateAIService: EstimateAIService,
  ) {}

  @EventPattern('estimate', Transport.REDIS)
  async requestEstimate(@Payload() data: EstimatePredictDto): Promise<any> {
    const { encodedId, computer } = data;
    const { cpu, gpu, rams, motherboard, disks } = computer;

    this.logger.warn(
      'requestEstimate EVENT',
      cpu,
      gpu,
      rams,
      motherboard,
      disks,
    );

    this.logger.verbose(encodedId, data);

    const systemInfo =
      await this.estimateService.getCachedSystemInfo(encodedId);

    // Todo: Impl
    // const sampleEstimate = await this.estimateService.getSampleEstimate({
    //   id: 'MOCK ID',
    // });
    //
    // if (!sampleEstimate) {
    //   throw new EntityNotfoundException({
    //     message: 'SampleEstimate not found.',
    //   });
    // }

    const estimate = await this.estimateAIService.requestEstimate(data);

    await this.estimateService.cacheEstimate(encodedId, estimate);

    const aiEstimate = await this.estimateService.getCachedEstimate(encodedId);

    this.logger.debug(aiEstimate);
    this.logger.debug('EventPattern EXTERNAL API REQUEST DONE');

    return { message: 'DONE', aiEstimate };
  }
}
