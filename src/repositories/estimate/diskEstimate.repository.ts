import { Injectable, Logger } from '@nestjs/common';
import { BaseRepository } from '../base.repository';
import { PrismaService } from '../../services/infra/prisma.service';
import { disk_estimate } from '@prisma/client';
import {
  IDiskEstimate,
  IDiskEstimateCreate,
} from '../../interfaces/computer/disk.interface';
import { v4 as uuidV4 } from 'uuid';

@Injectable()
export class DiskEstimateRepository extends BaseRepository<
  disk_estimate,
  IDiskEstimate
> {
  private readonly logger = new Logger(DiskEstimateRepository.name);

  protected _transform(entity: disk_estimate): IDiskEstimate {
    return {
      id: entity.id,
      hardwareId: entity.disk_id,
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

  async create(dto: IDiskEstimateCreate): Promise<IDiskEstimate> {
    try {
      this.logger.verbose(`Creating disk estimate`, dto);

      const diskEstimate = await this.prisma.disk_estimate.create({
        data: {
          id: uuidV4(),
          disk_id: dto.hardwareId,
          estimate_id: dto.estimateId,
          shop_id: dto.shopId,
          ai_answer_id: dto.aiAnswerId,
        },
      });
      return this._transform(diskEstimate);
    } catch (e) {
      this._handlePrismaError(e, `Estimate already exists.`);
    }
  }
}
