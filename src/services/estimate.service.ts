import { Injectable } from '@nestjs/common';
import { EstimateRepository } from '../repositories/estimate.repository';
import {
  EstimateCreateDto,
  EstimateDto,
  EstimateQueryDto,
} from '../dtos/estimate/estimate.dto';
import { RedisService } from './redis.service';
import { REDIS_ESTIMATE_PREFIX } from '../constants/redis.constant';
import { SampleEstimateRepository } from '../repositories/sampleEstimate.repository';
import {
  SampleEstimateDto,
  SampleEstimateQueryDto,
} from '../dtos/estimate/sampleEstimate.dto';
import { EntityConflictException } from '../exceptions/entityConflict.exception';
import { EntityNotfoundException } from '../exceptions/entityNotfound.exception';
import { EstimateAIResponseDto } from '../dtos/estimate/ai.dto';

@Injectable()
export class EstimateService {
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
    encodedId: string,
    dto: EstimateAIResponseDto,
  ): Promise<boolean> {
    return await this.redisService.setSerialize({
      prefix: REDIS_ESTIMATE_PREFIX,
      key: encodedId,
      value: dto,
    });
  }

  async getCachedEstimate(
    encodedId: string,
  ): Promise<EstimateAIResponseDto | null> {
    return await this.redisService.getDeserialize<EstimateAIResponseDto>({
      prefix: REDIS_ESTIMATE_PREFIX,
      key: encodedId,
    });
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
