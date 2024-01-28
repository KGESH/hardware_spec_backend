import { Injectable, Logger } from '@nestjs/common';
import { RedisService } from '../infra/redis.service';
import {
  IPartEstimate,
  IPartEstimateCreate,
} from '../../interfaces/estimate/part.interface';
import {
  REDIS_ESTIMATE_HARDWARE_PART_KEY,
  REDIS_ESTIMATE_HARDWARE_PART_PREFIX,
} from '../../constants/redis.constant';
import { CpuEstimateService } from './cpuEstimate.service';
import { GpuEstimateService } from './gpuEstimate.service';
import { UnknownException } from '../../exceptions/unknown.exception';
import { RamEstimateService } from './ramEstimate.service';
import { DiskEstimateService } from './diskEstimate.service';
import { MotherboardEstimateService } from './motherboardEstimate.service';

@Injectable()
export class EstimatePartService {
  private readonly logger = new Logger(EstimatePartService.name);

  constructor(
    private readonly cpuEstimateService: CpuEstimateService,
    private readonly gpuEstimateService: GpuEstimateService,
    private readonly motherboardEstimateService: MotherboardEstimateService,
    private readonly ramEstimateService: RamEstimateService,
    private readonly diskEstimateService: DiskEstimateService,
    private readonly redisService: RedisService,
  ) {}

  async createEstimatePart(dto: IPartEstimateCreate): Promise<IPartEstimate> {
    switch (dto.hardware.type) {
      case 'CPU':
        const cpuEstimate = await this.cpuEstimateService.createEstimate(dto);
        await this.cacheEstimatePart({
          partEstimate: {
            aiAnswer: cpuEstimate.aiAnswer,
            hardware: cpuEstimate.cpu,
            shopId: dto.shopId,
          },
          expiry: 600,
        });
        return {
          shopId: dto.shopId,
          hardware: cpuEstimate.cpu,
          aiAnswer: cpuEstimate.aiAnswer,
        };

      case 'GPU':
        const gpuEstimate = await this.gpuEstimateService.createEstimate(dto);
        await this.cacheEstimatePart({
          partEstimate: {
            aiAnswer: gpuEstimate.aiAnswer,
            hardware: gpuEstimate.gpu,
            shopId: dto.shopId,
          },
          expiry: 600,
        });
        return {
          shopId: dto.shopId,
          hardware: gpuEstimate.gpu,
          aiAnswer: gpuEstimate.aiAnswer,
        };

      case 'MB':
        const motherboardEstimate =
          await this.motherboardEstimateService.createEstimate(dto);
        await this.cacheEstimatePart({
          partEstimate: {
            aiAnswer: motherboardEstimate.aiAnswer,
            hardware: motherboardEstimate.motherboard,
            shopId: dto.shopId,
          },
          expiry: 600,
        });
        return {
          shopId: dto.shopId,
          hardware: motherboardEstimate.motherboard,
          aiAnswer: motherboardEstimate.aiAnswer,
        };

      case 'RAM':
        const ramEstimate = await this.ramEstimateService.createEstimate(dto);
        await this.cacheEstimatePart({
          partEstimate: {
            aiAnswer: ramEstimate.aiAnswer,
            hardware: ramEstimate.ram,
            shopId: dto.shopId,
          },
          expiry: 600,
        });
        return {
          shopId: dto.shopId,
          hardware: ramEstimate.ram,
          aiAnswer: ramEstimate.aiAnswer,
        };

      case 'DISK':
        const diskEstimate = await this.diskEstimateService.createEstimate(dto);
        await this.cacheEstimatePart({
          partEstimate: {
            aiAnswer: diskEstimate.aiAnswer,
            hardware: diskEstimate.disk,
            shopId: dto.shopId,
          },
          expiry: 600,
        });
        return {
          shopId: dto.shopId,
          hardware: diskEstimate.disk,
          aiAnswer: diskEstimate.aiAnswer,
        };

      default:
        throw new UnknownException('Unknown hardware type.');
    }
  }

  async cacheEstimatePart({
    partEstimate,
    expiry,
  }: {
    partEstimate: IPartEstimate;
    expiry?: number;
  }): Promise<boolean> {
    this.logger.debug(
      'Cache Estimate Part',
      partEstimate.hardware,
      partEstimate.aiAnswer,
    );
    return await this.redisService.setSerialize<IPartEstimate>({
      prefix: REDIS_ESTIMATE_HARDWARE_PART_PREFIX(partEstimate.hardware.type),
      key: REDIS_ESTIMATE_HARDWARE_PART_KEY({
        shopId: partEstimate.shopId,
        hardware: partEstimate.hardware,
      }),
      value: partEstimate,
      expiry,
    });
  }

  async getCachedEstimatePart({
    shopId,
    hardware,
  }: Omit<IPartEstimate, 'aiAnswer'>): Promise<IPartEstimate | null> {
    return await this.redisService.getDeserialize<IPartEstimate>({
      prefix: REDIS_ESTIMATE_HARDWARE_PART_PREFIX(hardware.type),
      key: REDIS_ESTIMATE_HARDWARE_PART_KEY({ shopId, hardware }),
    });
  }
}
