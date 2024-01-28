import { Injectable, Logger } from '@nestjs/common';
import { BaseRepository } from '../base.repository';
import { motherboard_estimate } from '@prisma/client';
import { PrismaService } from '../../services/infra/prisma.service';
import { v4 as uuidV4 } from 'uuid';
import {
  IMotherboardEstimate,
  IMotherboardEstimateCreate,
} from '../../interfaces/computer/motherboard.interface';

@Injectable()
export class MotherboardEstimateRepository extends BaseRepository<
  motherboard_estimate,
  IMotherboardEstimate
> {
  private readonly logger = new Logger(MotherboardEstimateRepository.name);

  protected _transform(entity: motherboard_estimate): IMotherboardEstimate {
    return {
      id: entity.id,
      hardwareId: entity.motherboard_id,
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

  async create(dto: IMotherboardEstimateCreate): Promise<IMotherboardEstimate> {
    try {
      this.logger.verbose(`Creating motherboard estimate`, dto);

      const motherboardEstimate = await this.prisma.motherboard_estimate.create(
        {
          data: {
            id: uuidV4(),
            motherboard_id: dto.hardwareId,
            estimate_id: dto.estimateId,
            shop_id: dto.shopId,
            ai_answer_id: dto.aiAnswerId,
          },
        },
      );
      return this._transform(motherboardEstimate);
    } catch (e) {
      this._handlePrismaError(e, `Estimate already exists.`);
    }
  }
}
