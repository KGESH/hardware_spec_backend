import { Injectable, Logger } from '@nestjs/common';
import { BaseRepository } from '../base.repository';
import { ram_estimate } from '@prisma/client';
import { PrismaService } from '../../services/infra/prisma.service';
import { v4 as uuidV4 } from 'uuid';
import {
  IRamEstimate,
  IRamEstimateCreate,
} from '../../interfaces/computer/ram.interface';

@Injectable()
export class RamEstimateRepository extends BaseRepository<
  ram_estimate,
  IRamEstimate
> {
  private readonly logger = new Logger(RamEstimateRepository.name);

  protected _transform(entity: ram_estimate): IRamEstimate {
    return {
      id: entity.id,
      hardwareId: entity.ram_id,
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

  async create(dto: IRamEstimateCreate): Promise<IRamEstimate> {
    try {
      this.logger.verbose(`Creating ram estimate`, dto);

      const ramEstimate = await this.prisma.ram_estimate.create({
        data: {
          id: uuidV4(),
          ram_id: dto.hardwareId,
          estimate_id: dto.estimateId,
          shop_id: dto.shopId,
          ai_answer_id: dto.aiAnswerId,
        },
      });
      return this._transform(ramEstimate);
    } catch (e) {
      this._handlePrismaError(e, `Estimate already exists.`);
    }
  }
}
