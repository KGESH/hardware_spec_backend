import { Controller, Logger } from '@nestjs/common';
import { ShopService } from '../services/shop/shop.service';
import { TypedBody, TypedParam, TypedRoute } from '@nestia/core';
import { ShopCreateDto, ShopDto } from '../dtos/shop/shop.dto';
import { ResponseDto } from '../dtos/response/response.dto';
import { EntityNotfoundException } from '../exceptions/entityNotfound.exception';

@Controller('shop')
export class ShopController {
  private readonly logger = new Logger(ShopController.name);

  constructor(private readonly shopService: ShopService) {}

  @TypedRoute.Get('/:id')
  async getShop(@TypedParam('id') id: string): Promise<ResponseDto<ShopDto>> {
    const shop = await this.shopService.findBy({
      id,
    });

    if (!shop) {
      throw new EntityNotfoundException({
        message: `Shop not found`,
      });
    }

    this.logger.debug(shop);

    return {
      status: 'success',
      data: shop,
    };
  }

  @TypedRoute.Post('/')
  async createShop(
    @TypedBody() dto: ShopCreateDto,
  ): Promise<ResponseDto<ShopDto>> {
    this.logger.debug(dto);

    const shop = await this.shopService.create({
      name: dto.name,
      country: dto.country,
    });

    this.logger.debug(shop);

    return {
      status: 'success',
      data: shop,
    };
  }
}
