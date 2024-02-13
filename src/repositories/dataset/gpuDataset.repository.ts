import { Injectable } from '@nestjs/common';
import { BaseRepository } from '../base.repository';
import { gpu_dataset } from '@prisma/client';
import {
  IGpuDataset,
  IGpuDatasetCreate,
  IGpuDatasetQuery,
} from '../../interfaces/dataset/gpuDataset.interfaces';
import { PrismaService } from '../../services/infra/prisma.service';
import { UnknownException } from '../../exceptions/unknown.exception';
import * as uuid from 'uuid';

@Injectable()
export class GpuDatasetRepository extends BaseRepository<
  gpu_dataset,
  IGpuDataset
> {
  constructor(private readonly prisma: PrismaService) {
    super();
  }

  protected _transform(entity: gpu_dataset): IGpuDataset {
    return {
      id: entity.id,
      category: entity.category,
      normalizedHwKey: entity.normalized_model_name,
      vendor: entity.vendor,
      metadata: entity.metadata,
    };
  }

  async findBy(query: IGpuDatasetQuery): Promise<IGpuDataset | null> {
    try {
      const gpu = await this.prisma.gpu_dataset.findUniqueOrThrow({
        where: {
          normalized_model_name: query.normalizedHwKey,
        },
      });
      return this._transform(gpu);
    } catch (e) {
      return this._handlePrismaNotFoundError(e);
    }
  }

  async create(dto: IGpuDatasetCreate): Promise<IGpuDataset> {
    try {
      const gpu = await this.prisma.gpu_dataset.create({
        data: {
          id: uuid.v4(),
          normalized_model_name: dto.normalizedHwKey,
          category: dto.category,
          vendor: dto.vendor,
          metadata: dto.metadata,
        },
      });
      return this._transform(gpu);
    } catch (e) {
      throw new UnknownException({
        e,
        message: 'GPU Dataset Creation Failed',
        data: dto,
      });
    }
  }

  async upsert(dto: IGpuDatasetCreate): Promise<IGpuDataset> {
    try {
      const gpu = await this.prisma.gpu_dataset.upsert({
        where: {
          normalized_model_name: dto.normalizedHwKey,
        },
        update: {
          category: dto.category,
          vendor: dto.vendor,
          metadata: dto.metadata,
        },
        create: {
          id: uuid.v4(),
          normalized_model_name: dto.normalizedHwKey,
          category: dto.category,
          vendor: dto.vendor,
          metadata: dto.metadata,
        },
      });
      return this._transform(gpu);
    } catch (e) {
      throw new UnknownException({ e, message: 'GPU Dataset Upsert Failed' });
    }
  }
}
