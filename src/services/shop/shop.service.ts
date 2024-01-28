import { Injectable, Logger } from '@nestjs/common';
import { ShopRepository } from '../../repositories/shop/shop.repository';
import {
  IShop,
  IShopCreate,
  IShopQuery,
} from '../../interfaces/shop/shop.interface';

@Injectable()
export class ShopService {
  private readonly logger = new Logger(ShopService.name);

  constructor(private readonly shopRepository: ShopRepository) {}

  async findBy(query: IShopQuery): Promise<IShop | null> {
    return this.shopRepository.findBy(query);
  }

  async create(dto: IShopCreate): Promise<IShop> {
    return this.shopRepository.create(dto);
  }
}
