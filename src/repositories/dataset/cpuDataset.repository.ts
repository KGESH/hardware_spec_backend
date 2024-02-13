import { Injectable } from '@nestjs/common';
import { BaseRepository } from '../base.repository';
import { cpu_dataset } from '@prisma/client';
import {
  ICpuDataset,
  ICpuDatasetCreate,
  ICpuDatasetQuery,
} from '../../interfaces/dataset/cpuDataset.interface';
import { PrismaService } from '../../services/infra/prisma.service';
import { UnknownException } from '../../exceptions/unknown.exception';
import * as uuid from 'uuid';

@Injectable()
export class CpuDatasetRepository extends BaseRepository<
  cpu_dataset,
  ICpuDataset
> {
  constructor(private readonly prisma: PrismaService) {
    super();
  }

  protected _transform(entity: cpu_dataset): ICpuDataset {
    return {
      id: entity.id,
      category: entity.category,
      normalizedHwKey: entity.normalized_model_name,
      vendor: entity.vendor,
      metadata: entity.metadata,
    };
  }

  async findBy(query: ICpuDatasetQuery): Promise<ICpuDataset | null> {
    try {
      const cpu = await this.prisma.cpu_dataset.findUniqueOrThrow({
        where: {
          normalized_model_name: query.normalizedHwKey,
        },
      });
      return this._transform(cpu);
    } catch (e) {
      return this._handlePrismaNotFoundError(e);
    }
  }

  async create(dto: ICpuDatasetCreate): Promise<ICpuDataset> {
    try {
      const cpu = await this.prisma.cpu_dataset.create({
        data: {
          id: uuid.v4(),
          normalized_model_name: dto.normalizedHwKey,
          category: dto.category,
          vendor: dto.vendor,
          metadata: dto.metadata,
        },
      });
      return this._transform(cpu);
    } catch (e) {
      throw new UnknownException({
        e,
        message: 'CPU Dataset Creation Failed',
        data: dto,
      });
    }
  }

  async upsert(dto: ICpuDatasetCreate): Promise<ICpuDataset> {
    try {
      const cpu = await this.prisma.cpu_dataset.upsert({
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
      return this._transform(cpu);
    } catch (e) {
      throw new UnknownException({ e, message: 'CPU Dataset Upsert Failed' });
    }
  }
}
