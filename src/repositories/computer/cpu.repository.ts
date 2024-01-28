import { Injectable, Logger } from '@nestjs/common';
import { BaseRepository } from '../base.repository';
import { cpu } from '@prisma/client';
import { PrismaService } from '../../services/infra/prisma.service';
import { v4 as uuidV4 } from 'uuid';
import {
  ICpu,
  ICpuCreate,
  ICpuQuery,
} from '../../interfaces/computer/cpu.interface';
@Injectable()
export class CpuRepository extends BaseRepository<cpu, ICpu> {
  private readonly logger = new Logger(CpuRepository.name);

  constructor(private readonly prisma: PrismaService) {
    super();
  }

  protected _transform(entity: cpu): ICpu {
    return {
      id: entity.id,
      type: 'CPU',
      hwKey: entity.hw_key,
      displayName: entity.model_name, // Todo: check display name
      vendorName: entity.vendor,
      coreCount: entity.core_count,
      threadCount: entity.thread_count,
      baseClock: entity.base_clock,
      boostClock: entity.boost_clock,
    };
  }

  async findBy(query: ICpuQuery): Promise<ICpu | null> {
    try {
      const cpu = await this.prisma.cpu.findUniqueOrThrow({
        where: { hw_key: query.hwKey },
      });

      this.logger.debug(cpu);

      return this._transform(cpu);
    } catch (e) {
      return this._handlePrismaNotFoundError(e, `CPU not found.`);
    }
  }

  async create(dto: ICpuCreate): Promise<ICpu> {
    try {
      const cpu = await this.prisma.cpu.create({
        data: {
          id: uuidV4(),
          hw_key: dto.hwKey,
          model_name: dto.displayName,
          vendor: dto.vendorName,
          core_count: dto.coreCount,
          thread_count: dto.threadCount,
          base_clock: dto.baseClock,
          boost_clock: dto.boostClock,
        },
      });
      return this._transform(cpu);
    } catch (e) {
      this._handlePrismaError(e, `CPU already exists.`);
    }
  }
}
