import { Controller, Logger } from '@nestjs/common';
import { TypedBody, TypedParam, TypedRoute } from '@nestia/core';
import { ResponseDto } from '../dtos/response/response.dto';
import { ComputerDto } from '../dtos/computer/computer.dto';
import { EventPublishService } from '../services/eventPublish.service';
import { EstimateService } from '../services/estimate.service';
import {
  EstimateCreateResponseDto,
  EstimateRequestDto,
} from '../dtos/estimate/estimate.dto';
import { ComputerService } from '../services/computer.service';
import { AIEstimateResponseDto } from '../dtos/estimate/ai.dto';
import { EntityNotfoundException } from '../exceptions/entityNotfound.exception';
import { ESTIMATE_CREATE_EVENT } from '../constants/estimate.constant';
import { v4 as uuidV4 } from 'uuid';

@Controller('estimate')
export class EstimateController {
  private readonly logger = new Logger(EstimateController.name);
  private readonly shopId = uuidV4(); // Todo: replace to real shopId

  constructor(
    private readonly estimateService: EstimateService,
    private readonly computerService: ComputerService,
    private readonly eventService: EventPublishService,
  ) {}

  @TypedRoute.Get('/:estimateId/:encodedId')
  async getEstimate(
    @TypedParam('estimateId') estimateId: string,
    @TypedParam('encodedId') encodedId: string,
  ): Promise<ResponseDto<AIEstimateResponseDto>> {
    this.logger.debug(`EncodedId`, encodedId);

    const estimate = await this.estimateService.getCachedEstimate({
      shopId: this.shopId,
      estimateId,
    });

    this.logger.debug(`Estimate`, estimate);

    if (!estimate) {
      throw new EntityNotfoundException({
        message: `Estimate not found`,
      });
    }

    // Check encodedId, if not match then hardware components are changed.
    if (estimate.status === 'success' && estimate.encodedId !== encodedId) {
      throw new EntityNotfoundException({
        message: `Encoded ID not matched. Probably hardware components are changed`,
      });
    }

    if (estimate.status === 'error') {
      throw new EntityNotfoundException({
        message: `Estimate created error`,
      });
    }

    return {
      status: 'success',
      data: estimate,
    };
  }

  @TypedRoute.Post('/:estimateId/:encodedId')
  async createEstimatePredict(
    @TypedParam('estimateId') estimateId: string,
    @TypedParam('encodedId') encodedId: string,
    @TypedBody() computerDto: ComputerDto,
  ): Promise<ResponseDto<EstimateCreateResponseDto>> {
    this.logger.debug(`Body`, estimateId, encodedId, computerDto);

    const aiRequestDto: EstimateRequestDto = {
      shopId: this.shopId, // Todo: replace to real shopId
      estimateId,
      encodedId,
      computer: computerDto,
    };

    const createdEstimate = await this.estimateService.getCachedEstimate({
      estimateId,
      shopId: aiRequestDto.shopId,
    });

    if (createdEstimate?.status === 'success') {
      return {
        status: 'success',
        data: {
          status: 'exist',
          shopId: aiRequestDto.shopId,
          encodedId,
          estimateId,
        },
      };
    }

    // Request Estimate from AI.
    await this.computerService.cacheComputerSpec(encodedId, computerDto);
    await this.eventService.emit(ESTIMATE_CREATE_EVENT, aiRequestDto);

    return {
      status: 'success',
      data: {
        status: 'pending',
        shopId: aiRequestDto.shopId,
        encodedId,
        estimateId,
      },
    };
  }
}
