import { Injectable, Logger } from '@nestjs/common';
import { BaseRepository } from '../base.repository';
import { gpu_estimate } from '@prisma/client';
import { PrismaService } from '../../services/infra/prisma.service';
import { v4 as uuidV4 } from 'uuid';
import {
  IGpuEstimate,
  IGpuEstimateCreate,
} from '../../interfaces/computer/gpu.interface';

@Injectable()
export class GpuEstimateRepository extends BaseRepository<
  gpu_estimate,
  IGpuEstimate
> {
  private readonly logger = new Logger(GpuEstimateRepository.name);

  protected _transform(entity: gpu_estimate): IGpuEstimate {
    return {
      id: entity.id,
      hardwareId: entity.gpu_id,
      estimateId: entity.estimate_id,
      shopId: entity.shop_id,
      aiAnswerId: entity.ai_answer_id,
      createdAt: entity.created_at.toISOString(),
      updatedAt: entity.updated_at.toISOString(),
      deletedAt: entity.deleted_at?.toISOString() ?? null,
    };
  }

  constructor(private readonly prisma: PrismaService) {
    super();
  }

  async create(dto: IGpuEstimateCreate): Promise<IGpuEstimate> {
    try {
      this.logger.verbose(`Creating gpu estimate`, dto);

      const gpuEstimate = await this.prisma.gpu_estimate.create({
        data: {
          id: uuidV4(),
          gpu_id: dto.hardwareId,
          estimate_id: dto.estimateId,
          shop_id: dto.shopId,
          ai_answer_id: dto.aiAnswerId,
        },
      });
      return this._transform(gpuEstimate);
    } catch (e) {
      this._handlePrismaError(e, `Estimate already exists.`);
    }
  }
}
