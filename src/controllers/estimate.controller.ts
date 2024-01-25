import { Controller, Logger } from '@nestjs/common';
import { TypedBody, TypedParam, TypedRoute } from '@nestia/core';
import { ResponseDto } from '../dtos/response/response.dto';
import { ComputerDto } from '../dtos/computer/computer.dto';
import { EventPublishService } from '../services/eventPublish.service';
import { EstimateService } from '../services/estimate.service';
import { EstimateRequestDto } from '../dtos/estimate/estimate.dto';
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

  @TypedRoute.Get('/:id')
  async getEstimate(
    @TypedParam('id') encodedId: string,
  ): Promise<ResponseDto<AIEstimateResponseDto>> {
    this.logger.debug(`EncodedId`, encodedId);

    const estimate = await this.estimateService.getCachedEstimate({
      shopId: this.shopId,
      encodedId,
    });

    this.logger.verbose(`Estimate`, estimate);

    if (!estimate) {
      throw new EntityNotfoundException({
        message: `Estimate not found`,
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

  @TypedRoute.Post('/:id')
  async createEstimatePredict(
    @TypedParam('id') encodedId: string,
    @TypedBody() computerDto: ComputerDto,
  ): Promise<ResponseDto<string>> {
    this.logger.debug(`Body`, encodedId, computerDto);

    const aiRequestDto: EstimateRequestDto = {
      shopId: this.shopId,
      encodedId,
      computer: computerDto,
    };

    const isCreated = await this.estimateService.getCachedEstimate({
      shopId: this.shopId,
      encodedId,
    });

    if (!isCreated) {
      await this.computerService.cacheComputerSpec(encodedId, computerDto);
      await this.eventService.emit(ESTIMATE_CREATE_EVENT, aiRequestDto);
    }

    return {
      status: 'success',
      data: encodedId,
    };
  }
}
