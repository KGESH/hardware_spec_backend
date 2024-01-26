import { Injectable, Logger } from '@nestjs/common';
import { EstimateRepository } from '../repositories/estimate.repository';
import {
  EstimateCacheDto,
  EstimateCreateDto,
  EstimateDto,
  EstimateQueryDto,
} from '../dtos/estimate/estimate.dto';
import { RedisService } from './redis.service';
import {
  REDIS_ESTIMATE_HARDWARE_PART_KEY,
  REDIS_ESTIMATE_HARDWARE_PART_PREFIX,
  REDIS_ESTIMATE_PREFIX,
} from '../constants/redis.constant';
import { SampleEstimateRepository } from '../repositories/sampleEstimate.repository';
import {
  SampleEstimateDto,
  SampleEstimateQueryDto,
} from '../dtos/estimate/sampleEstimate.dto';
import { EntityConflictException } from '../exceptions/entityConflict.exception';
import { EntityNotfoundException } from '../exceptions/entityNotfound.exception';
import {
  AIEstimateAnswerDto,
  AIEstimateResponseDto,
  AIEstimatePartDto,
} from '../dtos/estimate/ai.dto';

@Injectable()
export class EstimateService {
  private readonly logger = new Logger(EstimateService.name);

  constructor(
    private readonly estimateRepository: EstimateRepository,
    private readonly sampleEstimateRepository: SampleEstimateRepository,
    private readonly redisService: RedisService,
  ) {}

  async findEstimate(query: EstimateQueryDto): Promise<EstimateDto | null> {
    return await this.estimateRepository.findBy(query);
  }

  async createEstimate(dto: EstimateCreateDto): Promise<EstimateDto> {
    return await this.estimateRepository.create(dto);
  }

  async cacheEstimate(
    { shopId, estimateId }: Pick<EstimateCacheDto, 'shopId' | 'estimateId'>,
    estimateDto: AIEstimateResponseDto,
    expiry?: number,
  ): Promise<boolean> {
    return await this.redisService.setSerialize({
      prefix: REDIS_ESTIMATE_PREFIX(shopId),
      key: estimateId,
      value: estimateDto,
      expiry,
    });
  }

  async getCachedEstimate({
    shopId,
    estimateId,
  }: Pick<
    EstimateCacheDto,
    'shopId' | 'estimateId'
  >): Promise<AIEstimateResponseDto | null> {
    return await this.redisService.getDeserialize<AIEstimateResponseDto>({
      prefix: REDIS_ESTIMATE_PREFIX(shopId),
      key: estimateId,
    });
  }

  async cacheEstimatePart({
    estimatePart,
    expiry,
  }: {
    estimatePart: AIEstimatePartDto;
    expiry?: number;
  }): Promise<boolean> {
    this.logger.debug(
      'Cache Estimate Part',
      estimatePart.hardware,
      estimatePart.estimate,
    );
    return await this.redisService.setSerialize<AIEstimatePartDto>({
      prefix: REDIS_ESTIMATE_HARDWARE_PART_PREFIX(estimatePart.hardware.type),
      key: REDIS_ESTIMATE_HARDWARE_PART_KEY({
        shopId: estimatePart.shopId,
        hardware: estimatePart.hardware,
      }),
      value: estimatePart,
      expiry,
    });
  }

  async getCachedEstimatePart({
    shopId,
    hardware,
  }: Omit<AIEstimatePartDto, 'estimate'>): Promise<AIEstimatePartDto | null> {
    const estimatePart =
      await this.redisService.getDeserialize<AIEstimatePartDto>({
        prefix: REDIS_ESTIMATE_HARDWARE_PART_PREFIX(hardware.type),
        key: REDIS_ESTIMATE_HARDWARE_PART_KEY({ shopId, hardware }),
      });

    return estimatePart;
  }

  decodeEstimateId(estimateId: string): string {
    return atob(estimateId);
  }

  /**
   * Todo: Extract Sample Estimate
   */

  async getSampleEstimate(
    query: SampleEstimateQueryDto,
  ): Promise<SampleEstimateDto | null> {
    return await this.sampleEstimateRepository.findBy(query);
  }

  async createSampleEstimate(
    dto: SampleEstimateDto,
  ): Promise<SampleEstimateDto> {
    const found = await this.getSampleEstimate(dto);

    if (found) {
      throw new EntityConflictException({
        message: `SampleEstimate already exists.`,
      });
    }

    return await this.sampleEstimateRepository.create(dto);
  }

  async updateSampleEstimate(
    dto: SampleEstimateDto,
  ): Promise<SampleEstimateDto> {
    const found = await this.getSampleEstimate(dto);

    if (!found) {
      throw new EntityNotfoundException({
        message: `SampleEstimate not found.`,
      });
    }

    return await this.sampleEstimateRepository.update(dto);
  }
}
