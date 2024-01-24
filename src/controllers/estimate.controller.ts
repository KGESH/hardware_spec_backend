import { Controller, Logger } from '@nestjs/common';
import { TypedBody, TypedParam, TypedRoute } from '@nestia/core';
import { ResponseDto } from '../dtos/response/response.dto';
import { ComputerDto } from '../dtos/computer/computer.dto';
import { EventPublishService } from '../services/eventPublish.service';
import { EstimateService } from '../services/estimate.service';
import { EstimateRequestDto } from '../dtos/estimate/estimate.dto';
import { ComputerService } from '../services/computer.service';
import { EstimateAIResponseDto } from '../dtos/estimate/ai.dto';
import { EntityNotfoundException } from '../exceptions/entityNotfound.exception';

@Controller('estimate')
export class EstimateController {
  private readonly logger = new Logger(EstimateController.name);

  constructor(
    private readonly estimateService: EstimateService,
    private readonly computerService: ComputerService,
    private readonly eventService: EventPublishService,
  ) {}

  @TypedRoute.Get('/:id')
  async getEstimate(
    @TypedParam('id') encodedId: string,
  ): Promise<ResponseDto<EstimateAIResponseDto>> {
    this.logger.debug(`EncodedId`, encodedId);

    const estimate = await this.estimateService.getCachedEstimate(encodedId);

    this.logger.debug(`Estimate`, estimate);

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
      encodedId,
      computer: computerDto,
    };

    await this.computerService.cacheComputerSpec(encodedId, computerDto);

    await this.eventService.emit('estimate', aiRequestDto);

    return {
      status: 'success',
      data: encodedId,
    };
  }
}
