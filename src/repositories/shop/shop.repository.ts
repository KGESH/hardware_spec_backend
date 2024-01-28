import { Injectable, Logger } from '@nestjs/common';
import { BaseRepository } from '../base.repository';
import {
  IShop,
  IShopCreate,
  IShopQuery,
  IShopUpdate,
} from '../../interfaces/shop/shop.interface';
import { shop } from '@prisma/client';
import { PrismaService } from '../../services/infra/prisma.service';
import { v4 as uuidV4 } from 'uuid';

@Injectable()
export class ShopRepository extends BaseRepository<shop, IShop> {
  private readonly logger = new Logger(ShopRepository.name);

  constructor(private readonly prisma: PrismaService) {
    super();
  }

  protected _transform(entity: shop): IShop {
    return {
      id: entity.id,
      name: entity.name,
      country: entity.country,
      createdAt: entity.created_at.toISOString(),
      updatedAt: entity.updated_at.toISOString(),
      deletedAt: entity.deleted_at?.toISOString() ?? null,
    };
  }

  async findBy(query: IShopQuery): Promise<IShop | null> {
    try {
      const shop = await this.prisma.shop.findUniqueOrThrow({
        where: {
          id: query.id,
        },
      });
      return this._transform(shop);
    } catch (e) {
      return this._handlePrismaNotFoundError(e);
    }
  }

  async create(dto: IShopCreate): Promise<IShop> {
    try {
      const shop = await this.prisma.shop.create({
        data: {
          id: uuidV4(),
          name: dto.name,
          country: dto.country,
        },
      });
      return this._transform(shop);
    } catch (e) {
      this._handlePrismaError(e, `Shop already exists.`);
    }
  }

  async update(dto: IShopUpdate): Promise<IShop> {
    try {
      const shop = await this.prisma.shop.update({
        where: {
          id: dto.id,
        },
        data: {
          ...dto,
        },
      });
      return this._transform(shop);
    } catch (e) {
      this._handlePrismaError(e, `Shop not found.`);
    }
  }
}
