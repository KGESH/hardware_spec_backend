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
  private readonly shopId = '3d264daf-5aee-4e6e-afdc-31801beb04ad'; // Todo: replace to real shopId

  constructor(
    private readonly estimateService: EstimateService,
    private readonly computerService: ComputerService,
    private readonly eventService: EventPublishService,
    private readonly shopService: ShopService,
  ) {}

  @TypedRoute.Get('/:estimateId/:encodedId')
  async getEstimate(
    @TypedParam('estimateId') estimateId: string,
    @TypedParam('encodedId') encodedId: string,
  ): Promise<ResponseDto<AIEstimateResponseDto>> {
    this.logger.debug(`EncodedId`, encodedId);

    const estimate = await this.estimateService.getCachedEstimate({
      estimateId,
    });

    this.logger.debug(`Estimate`, estimate);

    if (!estimate) {
      throw new EntityNotfoundException({
        message: `Estimate not found`,
      });
    }

    // Check encodedId, if not match then hardware components are changed.
    if (estimate.status === 'estimated' && estimate.encodedId !== encodedId) {
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
      encodedId,
      computer: computerDto,
    };

    await this.estimateService.cacheEstimate({
      encodedId,
      status: 'draft',
      estimateId: estimate.id,
      shopId: this.shopId,
    });

    // const createdEstimate = await this.estimateService.getCachedEstimate({
    //   estimateId,
    // });
    //
    // if (createdEstimate?.status === 'success') {
    //   return {
    //     status: 'success',
    //     data: {
    //       status: 'exist',
    //       shopId: aiRequestDto.shopId,
    //       encodedId,
    //       estimateId,
    //     },
    //   };
    // }

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
