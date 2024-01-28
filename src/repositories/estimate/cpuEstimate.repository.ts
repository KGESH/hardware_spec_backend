import { Injectable, Logger } from '@nestjs/common';
import { BaseRepository } from '../base.repository';
import { cpu_estimate } from '@prisma/client';
import { PrismaService } from '../../services/infra/prisma.service';
import { v4 as uuidV4 } from 'uuid';
import {
  ICpuEstimate,
  ICpuEstimateCreate,
} from '../../interfaces/computer/cpu.interface';

@Injectable()
export class CpuEstimateRepository extends BaseRepository<
  cpu_estimate,
  ICpuEstimate
> {
  private readonly logger = new Logger(CpuEstimateRepository.name);

  protected _transform(entity: cpu_estimate): ICpuEstimate {
    return {
      id: entity.id,
      hardwareId: entity.cpu_id,
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

  async create(dto: ICpuEstimateCreate): Promise<ICpuEstimate> {
    try {
      this.logger.verbose(`Creating cpu estimate`, dto);

      const cpuEstimate = await this.prisma.cpu_estimate.create({
        data: {
          id: uuidV4(),
          cpu_id: dto.hardwareId,
          estimate_id: dto.estimateId,
          shop_id: dto.shopId,
          ai_answer_id: dto.aiAnswerId,
        },
      });
      return this._transform(cpuEstimate);
    } catch (e) {
      this._handlePrismaError(e, `Estimate already exists.`);
    }
  }
}
