import * as typia from 'typia';
import * as uuid from 'uuid';
import { shop } from '@prisma/client';
import {
  IShop,
  IShopCreate,
} from '../../../src/interfaces/shop/shop.interface';

export class MockShopHelper {
  static randomId = uuid.v4;
  static dto = typia.createRandom<IShop>();
  static createDto = typia.createRandom<IShopCreate>();
  static entity = typia.createRandom<shop>();
  static create(entity: shop) {
    return this.transform(entity);
  }

  static transform(entity: shop): IShop {
    return {
      id: entity.id,
      name: entity.name,
      country: entity.country,
      createdAt: entity.created_at.toISOString(),
      updatedAt: entity.updated_at.toISOString(),
      deletedAt: entity.deleted_at?.toISOString() ?? null,
    };
  }
}
