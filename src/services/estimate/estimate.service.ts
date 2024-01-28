import { Injectable, Logger } from '@nestjs/common';
import { EstimateRepository } from '../../repositories/estimate/estimate.repository';
import { RedisService } from '../infra/redis.service';
import { REDIS_ESTIMATE_PREFIX } from '../../constants/redis.constant';
import {
  IEstimate,
  IEstimateCacheQuery,
  IEstimateCreate,
  IEstimateQuery,
  IEstimateUpdate,
} from '../../interfaces/estimate/estimate.interface';
import {
  IPartEstimate,
  IPartEstimateCreate,
} from '../../interfaces/estimate/part.interface';
import { EstimatePartService } from './estimatePart.service';
import { EntityNotfoundException } from '../../exceptions/entityNotfound.exception';
import { AIEstimateResponseDto } from '../../dtos/estimate/estimate.dto';

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

  async findBy(query: IEstimateQuery): Promise<IEstimate | null> {
    return await this.estimateRepository.findBy(query);
  }

  async getEstimateWithParts(query: IEstimateQuery): Promise<IEstimate | null> {
    return await this.estimateRepository.findWithParts(query);
  }

  async cacheEstimate(
    estimateDto: AIEstimateResponseDto,
    expiry?: number,
  ): Promise<boolean> {
    return await this.redisService.setSerialize({
      prefix: REDIS_ESTIMATE_PREFIX('shopId'),
      key: estimateDto.estimateId,
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

  async updateEstimate(dto: IEstimateUpdate): Promise<IEstimate> {
    this.logger.verbose(`Update estimate`, dto);
    const found = await this.findBy(dto);

    if (!found)
      throw new EntityNotfoundException({ message: 'Estimate not found.' });

    return await this.estimateRepository.update(dto);
  }

  decodeEstimateId(estimateId: string): string {
    return atob(estimateId);
  }
}
