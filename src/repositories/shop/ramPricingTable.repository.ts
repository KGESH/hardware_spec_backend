import { BaseRepository } from '../base.repository';
import {
  IPricingTable,
  IPricingTableCreate,
  IPricingTableQuery,
  IPricingTableUpdate,
} from '../../interfaces/shop/pricingTable.interface';
import { ram_pricing_table } from '@prisma/client';
import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../services/infra/prisma.service';
import { v4 as uuidV4 } from 'uuid';

@Injectable()
export class RamPricingTableRepository extends BaseRepository<
  ram_pricing_table,
  IPricingTable
> {
  private readonly logger = new Logger(RamPricingTableRepository.name);

  constructor(private readonly prisma: PrismaService) {
    super();
  }

  protected _transform(entity: ram_pricing_table): IPricingTable {
    return {
      id: entity.id,
      shopId: entity.shop_id,
      type: 'RAM',
      sheets: entity.sheets,
      createdAt: entity.created_at.toISOString(),
      updatedAt: entity.updated_at.toISOString(),
      deletedAt: entity.deleted_at?.toISOString() ?? null,
    };
  }

  async findBy(query: IPricingTableQuery): Promise<IPricingTable | null> {
    try {
      if ('id' in query) {
        const pricingTable =
          await this.prisma.ram_pricing_table.findUniqueOrThrow({
            where: {
              id: query.id,
            },
          });
        return this._transform(pricingTable);
      }

      const pricingTable = await this.prisma.ram_pricing_table.findFirstOrThrow(
        {
          where: {
            shop_id: query.shopId,
          },
          orderBy: {
            created_at: 'desc',
          },
        },
      );
      return this._transform(pricingTable);
    } catch (e) {
      return this._handlePrismaNotFoundError(e);
    }
  }

  async create(dto: IPricingTableCreate): Promise<IPricingTable> {
    try {
      const pricingTable = await this.prisma.ram_pricing_table.create({
        data: {
          id: uuidV4(),
          shop_id: dto.shopId,
          sheets: dto.sheets,
        },
      });
      return this._transform(pricingTable);
    } catch (e) {
      return this._handlePrismaError(e, `Pricing Table creation error.`);
    }
  }

  async update(dto: IPricingTableUpdate): Promise<IPricingTable> {
    try {
      const pricingTable = await this.prisma.ram_pricing_table.update({
        where: {
          id: dto.id,
        },
        data: {
          sheets: dto.sheets,
        },
      });
      return this._transform(pricingTable);
    } catch (e) {
      return this._handlePrismaError(e, `Pricing Table update error.`);
    }
  }
}
