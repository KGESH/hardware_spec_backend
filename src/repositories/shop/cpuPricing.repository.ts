import { BaseRepository } from '../base.repository';
import {
  IHardwareWithPricing,
  IDatasetPricing,
  IDatasetPricingCreate,
} from '../../interfaces/shop/pricingTable.interface';
import { PrismaService } from '../../services/infra/prisma.service';
import * as uuid from 'uuid';
import { Injectable, Logger } from '@nestjs/common';
import { cpu_pricing, Prisma } from '@prisma/client';
import { UnknownException } from '../../exceptions/unknown.exception';
import { ICpuDataset } from '../../interfaces/dataset/cpuDataset.interfaces';
import { ICpuPricingQuery } from '../../interfaces/shop/cpuPricing.interfaces';

type PricingWithCpuDataset = Prisma.cpu_pricingGetPayload<{
  include: {
    cpu_dataset: true;
  };
}>;

@Injectable()
export class CpuPricingRepository extends BaseRepository<
  cpu_pricing,
  IDatasetPricing
> {
  private readonly logger = new Logger(CpuPricingRepository.name);

  constructor(private readonly prisma: PrismaService) {
    super();
  }

  protected _transform(entity: cpu_pricing): IDatasetPricing {
    return {
      id: entity.id,
      type: 'CPU',
      datasetId: entity.cpu_dataset_id,
      shopId: entity.shop_id,
      price: entity.price,
    };
  }

  private _transformWithDataset(
    entity: PricingWithCpuDataset,
  ): IHardwareWithPricing<ICpuDataset> {
    return {
      id: entity.id,
      type: 'CPU',
      shopId: entity.shop_id,
      price: entity.price,
      datasetId: entity.cpu_dataset_id,
      hardware: {
        id: entity.cpu_dataset.id,
        category: entity.cpu_dataset.category,
        normalizedHwKey: entity.cpu_dataset.normalized_model_name,
        vendor: entity.cpu_dataset.vendor,
        metadata: entity.cpu_dataset.metadata,
      },
    };
  }

  async findBy(query: ICpuPricingQuery): Promise<IDatasetPricing | null> {
    try {
      const pricing = await this.prisma.cpu_pricing.findFirstOrThrow({
        where: {
          shop_id: query.shopId,
          cpu_dataset: {
            normalized_model_name: query.hardware.normalizedHwKey,
          },
        },
      });
      return this._transform(pricing);
    } catch (e) {
      return this._handlePrismaNotFoundError(e);
    }
  }

  async findSimilarRowsWithCpu(
    query: Omit<ICpuPricingQuery, 'type'>,
  ): Promise<IHardwareWithPricing<ICpuDataset>[]> {
    try {
      const pricingRows = await this.prisma.cpu_pricing.findMany({
        include: {
          cpu_dataset: true,
        },
        where: {
          shop_id: query.shopId,
          cpu_dataset: {
            normalized_model_name: {
              contains: query.hardware.normalizedHwKey,
            },
          },
        },
      });

      if (pricingRows.length === 0) {
        throw new UnknownException({
          message: 'No pricing found. Check normalized_model_name contained',
          data: query,
        });
      }
      return pricingRows.map((pricing) => this._transformWithDataset(pricing));
    } catch (e) {
      throw new UnknownException(e);
    }
  }

  async create(dto: IDatasetPricingCreate): Promise<IDatasetPricing> {
    this.logger.verbose(dto);
    try {
      const pricing = await this.prisma.cpu_pricing.create({
        data: {
          id: uuid.v4(),
          cpu_dataset_id: dto.datasetId,
          shop_id: dto.shopId,
          price: dto.price,
        },
      });
      return this._transform(pricing);
    } catch (e) {
      this._handlePrismaError(e, `CPU Pricing already exists.`);
    }
  }
}
