import { Injectable, Logger } from '@nestjs/common';
import { BaseRepository } from '../base.repository';
import { PrismaService } from '../../services/infra/prisma.service';
import { motherboard } from '@prisma/client';
import { v4 as uuidV4 } from 'uuid';
import {
  IMotherboard,
  IMotherboardCreate,
  IMotherboardQuery,
} from '../../interfaces/computer/motherboard.interface';

@Injectable()
export class MotherboardRepository extends BaseRepository<
  motherboard,
  IMotherboard
> {
  private readonly logger = new Logger(MotherboardRepository.name);

  constructor(private readonly prisma: PrismaService) {
    super();
  }

  protected _transform(entity: motherboard): IMotherboard {
    return {
      id: entity.id,
      type: 'MB',
      hwKey: entity.hw_key,
      chipset: entity.chipset,
      displayName: entity.model_name, // Todo: check display name
      vendorName: entity.vendor,
    };
  }

  async findBy(query: IMotherboardQuery): Promise<IMotherboard | null> {
    try {
      const motherboard = await this.prisma.motherboard.findUniqueOrThrow({
        where: { hw_key: query.hwKey },
      });

      this.logger.debug(motherboard);

      return this._transform(motherboard);
    } catch (e) {
      return this._handlePrismaNotFoundError(e, `M/B not found.`);
    }
  }

  async create(dto: IMotherboardCreate): Promise<IMotherboard> {
    try {
      const motherboard = await this.prisma.motherboard.create({
        data: {
          id: uuidV4(),
          hw_key: dto.hwKey,
          chipset: dto.chipset,
          model_name: dto.displayName,
          vendor: dto.vendorName,
        },
      });
      return this._transform(motherboard);
    } catch (e) {
      this._handlePrismaError(e, `M/B already exists.`);
    }
  }
}
