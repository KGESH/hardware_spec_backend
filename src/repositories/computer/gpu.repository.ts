import { Injectable, Logger } from '@nestjs/common';
import { BaseRepository } from '../base.repository';
import {
  IGpu,
  IGpuCreate,
  IGpuQuery,
} from '../../interfaces/computer/gpu.interface';
import { PrismaService } from '../../services/infra/prisma.service';
import { gpu } from '@prisma/client';
import { v4 as uuidV4 } from 'uuid';

@Injectable()
export class GpuRepository extends BaseRepository<gpu, IGpu> {
  private readonly logger = new Logger(GpuRepository.name);

  constructor(private readonly prisma: PrismaService) {
    super();
  }

  protected _transform(entity: gpu): IGpu {
    return {
      id: entity.id,
      type: 'GPU',
      hwKey: entity.hw_key,
      chipset: entity.chipset,
      displayName: entity.model_name, // Todo: check display name
      vendorName: entity.vendor,
      subVendorName: entity.sub_vendor,
    };
  }

  async findBy(query: IGpuQuery): Promise<IGpu | null> {
    try {
      const gpu = await this.prisma.gpu.findUniqueOrThrow({
        where: { hw_key: query.hwKey },
      });

      this.logger.debug(gpu);

      return this._transform(gpu);
    } catch (e) {
      return this._handlePrismaNotFoundError(e, `GPU not found.`);
    }
  }

  async create(dto: IGpuCreate): Promise<IGpu> {
    try {
      const gpu = await this.prisma.gpu.create({
        data: {
          id: uuidV4(),
          hw_key: dto.hwKey,
          chipset: dto.chipset,
          model_name: dto.displayName,
          vendor: dto.vendorName,
          sub_vendor: dto.subVendorName,
        },
      });
      return this._transform(gpu);
    } catch (e) {
      this._handlePrismaError(e, `GPU already exists.`);
    }
  }
}
