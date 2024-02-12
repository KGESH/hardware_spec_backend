import { Injectable, Logger } from '@nestjs/common';
import { BaseRepository } from '../base.repository';
import { PrismaService } from '../../services/infra/prisma.service';
import { ram } from '@prisma/client';
import { v4 as uuidV4 } from 'uuid';
import {
  IRam,
  IRamCreate,
  IRamQuery,
} from '../../interfaces/computer/ram.interface';

@Injectable()
export class RamRepository extends BaseRepository<ram, IRam> {
  private readonly logger = new Logger(RamRepository.name);

  constructor(private readonly prisma: PrismaService) {
    super();
  }

  protected _transform(entity: ram): IRam {
    return {
      id: entity.id,
      type: 'RAM',
      hwKey: entity.hw_key,
      normalizedHwKey: entity.hw_key,
      displayName: entity.model_name, // Todo: check display name
      vendorName: entity.vendor,
    };
  }

  async findBy(query: IRamQuery): Promise<IRam | null> {
    try {
      const ram = await this.prisma.ram.findUniqueOrThrow({
        where: { hw_key: query.hwKey },
      });

      this.logger.debug(ram);

      return this._transform(ram);
    } catch (e) {
      return this._handlePrismaNotFoundError(e, `RAM not found.`);
    }
  }

  async create(dto: IRamCreate): Promise<IRam> {
    try {
      const ram = await this.prisma.ram.create({
        data: {
          id: uuidV4(),
          hw_key: dto.hwKey,
          model_name: dto.displayName,
          vendor: dto.vendorName,
        },
      });
      return this._transform(ram);
    } catch (e) {
      this._handlePrismaError(e, `RAM already exists.`);
    }
  }

  async createIfNotExist(dto: IRamCreate): Promise<IRam> {
    try {
      const ram = await this.prisma.ram.upsert({
        where: { hw_key: dto.hwKey },
        update: {},
        create: {
          id: uuidV4(),
          hw_key: dto.hwKey,
          model_name: dto.displayName,
          vendor: dto.vendorName,
        },
      });
      return this._transform(ram);
    } catch (e) {
      this._handlePrismaError(e, `RAM createIfNotExist unknown error.`);
    }
  }
}
