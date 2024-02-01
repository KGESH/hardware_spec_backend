import { Controller, Logger } from '@nestjs/common';
import { EventPattern, Payload, Transport } from '@nestjs/microservices';
import {
  AIEstimatedDto,
  AIEstimateErrorDto,
  EstimateRequestDto,
} from '../dtos/estimate/estimate.dto';
import { EstimateAIService } from '../services/estimate/estimateAI.service';
import { ESTIMATE_CREATE_EVENT } from '../constants/estimate.constant';
import { ComputerService } from '../services/computer/computer.service';
import { ShopService } from '../services/shop/shop.service';
import { EntityNotfoundException } from '../exceptions/entityNotfound.exception';
import { getCurrency } from '../utils/currency';
import { EstimateService } from '../services/estimate/estimate.service';

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
    const { shopId, estimateId } = data;

    const computer = await this.computerService.getComputer(data.computer);
    this.logger.debug(computer);

    const shop = await this.shopService.findBy({ id: shopId });
    if (!shop) throw new EntityNotfoundException({ message: `Shop not found` });

    // Todo: make dto
    const estimateParts = await this.estimateAIService.requestEstimate({
      shopId,
      computer,
      estimateId,
      currency: getCurrency(shop.country),
    });

    // Estimate Creation failed
    if (estimateParts.length === 0) {
      const errorResponse: AIEstimateErrorDto = {
        status: 'error',
        message: 'Estimate not created',
        shopId,
        estimateId,
      };
      await this.estimateService.updateEstimate({
        id: estimateId,
        status: 'error',
      });
      await this.estimateAIService.cacheEstimateStatus(errorResponse);
      this.logger.debug('Estimate Creation failed', errorResponse);
      return errorResponse;
    }

    const successResponse: AIEstimatedDto = {
      status: 'estimated',
      shopId,
      estimateId,
      estimates: estimateParts,
    };
    await this.estimateService.updateEstimate({
      id: estimateId,
      status: 'estimated',
    });
    await this.estimateAIService.cacheEstimateStatus(successResponse);
    this.logger.debug('Estimate Creation success', successResponse);
    return successResponse;
  }
}
