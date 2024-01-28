import { Controller, Logger } from '@nestjs/common';
import { EventPattern, Payload, Transport } from '@nestjs/microservices';
import { EstimateRequestDto } from '../dtos/estimate/estimate.dto';
import { EstimateAIService } from '../services/estimate/estimateAI.service';
import { ESTIMATE_CREATE_EVENT } from '../constants/estimate.constant';
import { ComputerService } from '../services/computer/computer.service';
import { ShopService } from '../services/shop/shop.service';
import { EntityNotfoundException } from '../exceptions/entityNotfound.exception';
import { getCurrency } from '../utils/currency';
import { EstimateService } from '../services/estimate/estimate.service';
import { AIEstimateResponseDto } from '../dtos/estimate/ai.dto';

@Controller()
export class EventSubscribeController {
  private readonly logger = new Logger(EventSubscribeController.name);

  constructor(
    private readonly computerService: ComputerService,
    private readonly estimateAIService: EstimateAIService,
    private readonly shopService: ShopService,
    private readonly estimateService: EstimateService,
  ) {}

  @EventPattern(ESTIMATE_CREATE_EVENT, Transport.REDIS)
  async requestEstimate(@Payload() data: EstimateRequestDto): Promise<any> {
    this.logger.debug('EventPattern EXTERNAL API REQUEST START', data);

    const computer = await this.computerService.getComputer(data.computer);

    const shop = await this.shopService.findBy({
      id: data.shopId,
    });

    if (!shop) {
      throw new EntityNotfoundException({
        message: `Shop not found`,
      });
    }

    // Cache estimate create status
    await this.estimateAIService.cacheEstimateStatus(
      {
        estimateId: data.estimateId,
      },
      {
        status: 'pending',
        shopId: data.shopId,
        encodedId: data.encodedId,
        estimateId: data.estimateId,
      },
    );

    const estimate = await this.estimateService.createEstimate({
      id: data.estimateId,
      name: 'Estimate',
      country: shop.country,
    });

    // Todo: make dto
    const estimateParts = await this.estimateAIService.requestEstimate({
      computer,
      currency: getCurrency(shop.country),
      shopId: shop.id,
      estimateId: estimate.id,
    });

    const response: AIEstimateResponseDto =
      estimateParts.length === 0
        ? {
            status: 'error',
            message: 'Estimate not created',
            shopId: shop.id,
            estimateId: estimate.id,
            encodedId: data.encodedId,
          }
        : {
            status: 'success',
            shopId: shop.id,
            estimateId: estimate.id,
            encodedId: data.encodedId,
            estimates: estimateParts,
          };

    // Cache created estimate
    await this.estimateAIService.cacheEstimateStatus(
      {
        estimateId: data.estimateId,
      },
      response,
    );

    this.logger.debug('EventPattern EXTERNAL API REQUEST DONE', response);

    return { message: 'DONE' };
  }
}
