import { Injectable, Logger } from '@nestjs/common';
import { BaseRepository } from '../base.repository';
import { PrismaService } from '../../services/infra/prisma.service';
import { estimate, Prisma } from '@prisma/client';
import {
  IEstimate,
  IEstimateCreate,
  IEstimateQuery,
  IEstimateUpdate,
} from '../../interfaces/estimate/estimate.interface';
import { v4 as uuidV4 } from 'uuid';
import { IHardwareType } from '../../interfaces/computer/hardware.interface';

type EstimateWithParts = Prisma.estimateGetPayload<{
  include: {
    cpu_estimate: {
      include: {
        cpu: true;
        ai_answer: true;
      };
    };
    gpu_estimate: {
      include: {
        gpu: true;
        ai_answer: true;
      };
    };
    motherboard_estimate: {
      include: {
        motherboard: true;
        ai_answer: true;
      };
    };
    ram_estimate: {
      include: {
        ram: true;
        ai_answer: true;
      };
    };
    disk_estimate: {
      include: {
        disk: true;
        ai_answer: true;
      };
    };
  };
}>;

@Injectable()
export class EstimateRepository extends BaseRepository<estimate, IEstimate> {
  private readonly logger = new Logger(EstimateRepository.name);

  constructor(private readonly prisma: PrismaService) {
    super();
  }

  protected _transform(entity: estimate): IEstimate {
    return {
      id: entity.id,
      status: entity.status,
      name: entity.name,
      parts: [],
    };
  }

  private _transformWithParts(estimate: EstimateWithParts): IEstimate {
    return {
      id: estimate.id,
      status: estimate.status,
      name: estimate.name,
      parts: [
        ...estimate.cpu_estimate.map((cpuEstimate) => {
          return {
            shopId: cpuEstimate.shop_id,
            hardware: {
              id: cpuEstimate.cpu.id,
              hwKey: cpuEstimate.cpu.hw_key,
              normalizedHwKey: cpuEstimate.cpu.normalized_hw_key,
              vendorName: cpuEstimate.cpu.vendor,
              displayName: cpuEstimate.cpu.model_name,
              type: 'CPU' as IHardwareType,
            },
            aiAnswer: {
              id: cpuEstimate.ai_answer_id,
              name: cpuEstimate.ai_answer.name,
              tablePrice: cpuEstimate.ai_answer.table_price,
              buyingPrice: cpuEstimate.ai_answer.buying_price,
              currency: cpuEstimate.ai_answer.currency,
              metadata: cpuEstimate.ai_answer.metadata,
            },
          };
        }),
        ...estimate.gpu_estimate.map((gpuEstimate) => {
          return {
            shopId: gpuEstimate.shop_id,
            hardware: {
              id: gpuEstimate.gpu.id,
              hwKey: gpuEstimate.gpu.hw_key,
              normalizedHwKey: gpuEstimate.gpu.hw_key, // Todo: replace
              vendorName: gpuEstimate.gpu.vendor,
              displayName: gpuEstimate.gpu.model_name,
              type: 'GPU' as IHardwareType,
            },
            aiAnswer: {
              id: gpuEstimate.ai_answer_id,
              name: gpuEstimate.ai_answer.name,
              tablePrice: gpuEstimate.ai_answer.table_price,
              buyingPrice: gpuEstimate.ai_answer.buying_price,
              currency: gpuEstimate.ai_answer.currency,
              metadata: gpuEstimate.ai_answer.metadata,
            },
          };
        }),
        ...estimate.motherboard_estimate.map((motherboardEstimate) => {
          return {
            shopId: motherboardEstimate.shop_id,
            hardware: {
              id: motherboardEstimate.motherboard.id,
              hwKey: motherboardEstimate.motherboard.hw_key,
              normalizedHwKey: motherboardEstimate.motherboard.hw_key, // Todo: replace
              vendorName: motherboardEstimate.motherboard.vendor,
              displayName: motherboardEstimate.motherboard.model_name,
              type: 'MB' as IHardwareType,
            },
            aiAnswer: {
              id: motherboardEstimate.ai_answer_id,
              name: motherboardEstimate.ai_answer.name,
              tablePrice: motherboardEstimate.ai_answer.table_price,
              buyingPrice: motherboardEstimate.ai_answer.buying_price,
              currency: motherboardEstimate.ai_answer.currency,
              metadata: motherboardEstimate.ai_answer.metadata,
            },
          };
        }),
        ...estimate.ram_estimate.map((ramEstimate) => {
          return {
            shopId: ramEstimate.shop_id,
            hardware: {
              id: ramEstimate.ram.id,
              hwKey: ramEstimate.ram.hw_key,
              normalizedHwKey: ramEstimate.ram.hw_key, // Todo: replace
              vendorName: ramEstimate.ram.vendor,
              displayName: ramEstimate.ram.model_name,
              type: 'RAM' as IHardwareType,
            },
            aiAnswer: {
              id: ramEstimate.ai_answer_id,
              name: ramEstimate.ai_answer.name,
              tablePrice: ramEstimate.ai_answer.table_price,
              buyingPrice: ramEstimate.ai_answer.buying_price,
              currency: ramEstimate.ai_answer.currency,
              metadata: ramEstimate.ai_answer.metadata,
            },
          };
        }),
        ...estimate.disk_estimate.map((diskEstimate) => {
          return {
            shopId: diskEstimate.shop_id,
            hardware: {
              id: diskEstimate.disk.id,
              hwKey: diskEstimate.disk.hw_key,
              normalizedHwKey: diskEstimate.disk.hw_key, // Todo: replace
              vendorName: diskEstimate.disk.vendor,
              displayName: diskEstimate.disk.model_name,
              type: 'DISK' as IHardwareType,
            },
            aiAnswer: {
              id: diskEstimate.ai_answer_id,
              name: diskEstimate.ai_answer.name,
              tablePrice: diskEstimate.ai_answer.table_price,
              buyingPrice: diskEstimate.ai_answer.buying_price,
              currency: diskEstimate.ai_answer.currency,
              metadata: diskEstimate.ai_answer.metadata,
            },
          };
        }),
      ],
    };
  }

  async findBy({ id }: IEstimateQuery): Promise<IEstimate | null> {
    try {
      const estimate = await this.prisma.estimate.findUniqueOrThrow({
        where: { id },
      });

      this.logger.debug(estimate);

      return this._transform(estimate);
    } catch (e) {
      return this._handlePrismaNotFoundError(e, `Estimate not found.`);
    }
  }

  async findWithParts({ id }: IEstimateQuery): Promise<IEstimate | null> {
    try {
      const estimate = await this.prisma.estimate.findUniqueOrThrow({
        where: { id },
        include: {
          cpu_estimate: {
            include: {
              cpu: true,
              ai_answer: true,
            },
          },
          gpu_estimate: {
            include: {
              gpu: true,
              ai_answer: true,
            },
          },
          motherboard_estimate: {
            include: {
              motherboard: true,
              ai_answer: true,
            },
          },
          ram_estimate: {
            include: {
              ram: true,
              ai_answer: true,
            },
          },
          disk_estimate: {
            include: {
              disk: true,
              ai_answer: true,
            },
          },
        },
      });

      this.logger.debug(estimate);

      return this._transformWithParts(estimate);
    } catch (e) {
      return this._handlePrismaNotFoundError(e, `Estimate not found.`);
    }
  }

  async findMany(): Promise<IEstimate[]> {
    try {
      const estimates = await this.prisma.estimate.findMany();
      return estimates.map((estimate) => this._transform(estimate));
    } catch (e) {
      this._handlePrismaError(e, 'Estimates findMany error.');
    }
  }

  async create(dto: IEstimateCreate): Promise<IEstimate> {
    try {
      const created = await this.prisma.estimate.create({
        data: {
          id: uuidV4(),
          status: dto.status,
          name: dto.name,
        },
      });

      this.logger.debug(created);

      return this._transform(created);
    } catch (e) {
      this._handlePrismaError(e, `Estimate already exists.`);
    }
  }

  async update(dto: IEstimateUpdate): Promise<IEstimate> {
    try {
      const updated = await this.prisma.estimate.update({
        where: { id: dto.id },
        data: dto,
      });

      this.logger.debug(updated);

      return this._transform(updated);
    } catch (e) {
      this._handlePrismaError(e, `Estimate not found.`);
    }
  }

  async delete(id: string): Promise<boolean> {
    try {
      const deleted = await this.prisma.estimate.update({
        where: { id },
        data: { deleted_at: new Date() },
      });

      this.logger.debug(deleted);

      return true;
    } catch (e) {
      this._handlePrismaError(e, `Estimate not found.`);
    }
  }
}
