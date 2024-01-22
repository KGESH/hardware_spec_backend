import { Controller, Logger } from '@nestjs/common';
import { TypedBody, TypedParam, TypedRoute } from '@nestia/core';
import { ResponseDto } from '../dtos/response/response.dto';
import { ComputerDto } from '../dtos/computer/computer.dto';
import { EventPublishService } from '../services/eventPublish.service';
import { EstimateService } from '../services/estimate.service';
import { EstimatePredictDto } from '../dtos/estimate/estimate.dto';

@Controller('estimate')
export class EstimateController {
  private readonly logger = new Logger(EstimateController.name);

  constructor(
    private readonly estimateService: EstimateService,
    private readonly eventService: EventPublishService,
  ) {}

  @TypedRoute.Get('/:id')
  async getEstimate(
    @TypedParam('id') id: string,
  ): Promise<ResponseDto<string>> {
    this.logger.debug(`GET`, id);

    // emit event to my gateway
    // this.eventService.emit('estimate', { message: 'hello, world!' });

    // return immediately
    return {
      status: 'success',
      data: `request accept ${id}`,
    };
  }

  @TypedRoute.Post('/:id')
  async createEstimate(
    @TypedParam('id') encodedId: string,
    @TypedBody() dto: ComputerDto,
  ): Promise<ResponseDto<string>> {
    this.logger.debug(`Body`, encodedId, dto);

    const aiPredictDto: EstimatePredictDto = {
      encodedId,
      computer: dto,
    };

    await this.estimateService.cacheSystemInfo(encodedId, dto);

    await this.eventService.emit('estimate', aiPredictDto);

    return {
      status: 'success',
      data: encodedId,
    };
  }
}
