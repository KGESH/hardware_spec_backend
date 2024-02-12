import { Injectable, Logger } from '@nestjs/common';
import { BaseRepository } from '../base.repository';
import { PrismaService } from '../../services/infra/prisma.service';
import { disk } from '@prisma/client';
import { v4 as uuidV4 } from 'uuid';
import {
  IDisk,
  IDiskCreate,
  IDiskQuery,
} from '../../interfaces/computer/disk.interface';

@Injectable()
export class DiskRepository extends BaseRepository<disk, IDisk> {
  private readonly logger = new Logger(DiskRepository.name);

  constructor(private readonly prisma: PrismaService) {
    super();
  }

  protected _transform(entity: disk): IDisk {
    return {
      id: entity.id,
      type: 'DISK',
      kind: entity.kind,
      totalSpace: Number(entity.total_space),
      hwKey: entity.hw_key,
      normalizedHwKey: entity.hw_key,
      displayName: entity.model_name, // Todo: check display name
      vendorName: entity.vendor,
    };
  }

  async findBy(query: IDiskQuery): Promise<IDisk | null> {
    try {
      const disk = await this.prisma.disk.findUniqueOrThrow({
        where: { hw_key: query.hwKey },
      });

      this.logger.debug(disk);

      return this._transform(disk);
    } catch (e) {
      return this._handlePrismaNotFoundError(e, `DISK not found.`);
    }
  }

  async create(dto: IDiskCreate): Promise<IDisk> {
    try {
      this.logger.verbose('========CREATE DISK========');
      this.logger.verbose(dto);
      const disk = await this.prisma.disk.create({
        data: {
          id: uuidV4(),
          hw_key: dto.hwKey,
          kind: dto.kind,
          total_space: dto.totalSpace,
          model_name: dto.displayName,
          vendor: dto.vendorName,
        },
      });
      return this._transform(disk);
    } catch (e) {
      this._handlePrismaError(e, `DISK already exists.`);
    }
  }

  async createIfNotExist(dto: IDiskCreate): Promise<IDisk> {
    try {
      const disk = await this.prisma.disk.upsert({
        where: { hw_key: dto.hwKey },
        update: {
          hw_key: dto.hwKey,
          kind: dto.kind,
          total_space: dto.totalSpace,
          model_name: dto.displayName,
          vendor: dto.vendorName,
        },
        create: {
          id: uuidV4(),
          hw_key: dto.hwKey,
          kind: dto.kind,
          total_space: dto.totalSpace,
          model_name: dto.displayName,
          vendor: dto.vendorName,
        },
      });
      return this._transform(disk);
    } catch (e) {
      this._handlePrismaError(e, `DISK createIfNotExist unknown error.`);
    }
  }
}
