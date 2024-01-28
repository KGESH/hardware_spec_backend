import { Injectable, Logger } from '@nestjs/common';
import { EstimateRepository } from '../../repositories/estimate/estimate.repository';
import { RedisService } from '../infra/redis.service';
import { REDIS_ESTIMATE_PREFIX } from '../../constants/redis.constant';
import { AIEstimateResponseDto } from '../../dtos/estimate/ai.dto';
import {
  IEstimate,
  IEstimateCacheQuery,
  IEstimateCreate,
} from '../../interfaces/estimate/estimate.interface';
import {
  IPartEstimate,
  IPartEstimateCreate,
} from '../../interfaces/estimate/part.interface';
import { EstimatePartService } from './estimatePart.service';

@Injectable()
export class EstimateService {
  private readonly logger = new Logger(EstimateService.name);

  constructor(
    private readonly estimateRepository: EstimateRepository,
    private readonly estimatePartService: EstimatePartService,
    private readonly redisService: RedisService,
  ) {}

  async saveEstimatePart(dto: IPartEstimateCreate): Promise<IPartEstimate> {
    return await this.estimatePartService.createEstimatePart(dto);
  }

  async createEstimate(dto: IEstimateCreate): Promise<IEstimate> {
    return await this.estimateRepository.create(dto);
  }

  async cacheEstimate(
    { estimateId }: IEstimateCacheQuery,
    estimateDto: AIEstimateResponseDto,
    expiry?: number,
  ): Promise<boolean> {
    return await this.redisService.setSerialize({
      prefix: REDIS_ESTIMATE_PREFIX('shopId'),
      key: estimateId,
      value: estimateDto,
      expiry,
    });
  }

  async getCachedEstimate({
    estimateId,
  }: IEstimateCacheQuery): Promise<AIEstimateResponseDto | null> {
    return await this.redisService.getDeserialize<AIEstimateResponseDto>({
      prefix: REDIS_ESTIMATE_PREFIX('shopId'),
      key: estimateId,
    });
  }

  async getCachedEstimatePart(
    dto: Omit<IPartEstimate, 'aiAnswer'>,
  ): Promise<IPartEstimate | null> {
    return this.estimatePartService.getCachedEstimatePart(dto);
  }

  decodeEstimateId(estimateId: string): string {
    return atob(estimateId);
  }
}
