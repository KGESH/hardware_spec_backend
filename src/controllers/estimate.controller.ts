import { Controller, Logger } from '@nestjs/common';
import { TypedBody, TypedParam, TypedRoute } from '@nestia/core';
import { ResponseDto } from '../dtos/response/response.dto';
import { ComputerDto } from '../dtos/computer/computer.dto';
import { EventPublishService } from '../services/infra/eventPublish.service';
import { EstimateService } from '../services/estimate/estimate.service';
import {
  AIEstimateResponseDto,
  EstimateCreateResponseDto,
  EstimateRequestDto,
} from '../dtos/estimate/estimate.dto';
import { ComputerService } from '../services/computer/computer.service';
import { EntityNotfoundException } from '../exceptions/entityNotfound.exception';
import { ESTIMATE_CREATE_EVENT } from '../constants/estimate.constant';
import { ShopService } from '../services/shop/shop.service';

@Controller('estimate')
export class EstimateController {
  private readonly logger = new Logger(EstimateController.name);
  private readonly shopId = '1f730024-f112-4532-ac30-7ba25eea955e'; // Todo: replace to real shopId

  constructor(
    private readonly estimateService: EstimateService,
    private readonly computerService: ComputerService,
    private readonly eventService: EventPublishService,
    private readonly shopService: ShopService,
  ) {}

  @TypedRoute.Get('/:estimateId')
  async getEstimate(
    @TypedParam('estimateId') estimateId: string,
  ): Promise<ResponseDto<AIEstimateResponseDto>> {
    this.logger.debug(`getEstimate`);

    const cachedEstimate = await this.estimateService.getCachedEstimate({
      estimateId,
    });

    if (cachedEstimate) {
      return {
        status: 'success',
        data: cachedEstimate,
      };
    }

    const estimate = await this.estimateService.getEstimateWithParts({
      id: estimateId,
    });

    if (!estimate)
      throw new EntityNotfoundException({ message: `Estimate not found` });

    this.logger.verbose(`Transofmred PARTS`, estimate.parts);

    return {
      status: 'success',
      data: {
        status: 'estimated',
        shopId: this.shopId,
        estimateId: estimate.id,
        estimates: estimate.parts,
      },
    };
  }

  @TypedRoute.Post('/:encodedId')
  async createEstimatePredict(
    @TypedParam('encodedId') encodedId: string,
    @TypedBody() computerDto: ComputerDto,
  ): Promise<ResponseDto<EstimateCreateResponseDto>> {
    this.logger.debug(`Body`, encodedId, computerDto);

    const shop = await this.shopService.findBy({ id: this.shopId });

    if (!shop) throw new EntityNotfoundException({ message: `Shop not found` });

    const estimate = await this.estimateService.createEstimate({
      name: `${shop.name}_${new Date().toISOString()}`, // Todo: replace
      status: 'draft',
    });

    const aiRequestDto: EstimateRequestDto = {
      shopId: this.shopId, // Todo: replace to real shopId
      estimateId: estimate.id,
      computer: computerDto,
    };

    this.logger.verbose(`==========AI Request DTO==========`, aiRequestDto);

    await this.estimateService.cacheEstimate({
      status: 'draft',
      estimateId: estimate.id,
      shopId: this.shopId,
    });

    // Todo: change cache logic. remove encoded Id
    // Request Estimate from AI.
    await this.computerService.cacheComputerSpec(encodedId, computerDto);
    await this.eventService.emit(ESTIMATE_CREATE_EVENT, aiRequestDto);

    return {
      status: 'success',
      data: {
        status: 'draft',
        shopId: aiRequestDto.shopId,
        estimateId: estimate.id,
        encodedId,
      },
    };
  }
}
