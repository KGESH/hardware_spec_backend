import { Controller, Logger } from '@nestjs/common';
import { ShopService } from '../services/shop/shop.service';
import { PricingTableService } from '../services/shop/pricingTable.service';
import { TypedBody, TypedQuery, TypedRoute } from '@nestia/core';
import { ResponseDto } from '../dtos/response/response.dto';
import {
  PricingTableCreateDto,
  PricingTableDto,
  PricingTableQueryDto,
} from '../dtos/shop/pricing.table.dto';
import { EntityNotfoundException } from '../exceptions/entityNotfound.exception';

@Controller('pricing')
export class PricingTableController {
  private readonly logger = new Logger(PricingTableController.name);

  constructor(
    private readonly shopService: ShopService,
    private readonly pricingTableService: PricingTableService,
  ) {}

  @TypedRoute.Get('/')
  async getPricingTable(
    @TypedQuery() query: PricingTableQueryDto,
  ): Promise<ResponseDto<PricingTableDto>> {
    const pricingTable = await this.pricingTableService.findPricingTable(query);

    if (!pricingTable) {
      throw new EntityNotfoundException({
        message: `Pricing table not found`,
      });
    }

    return {
      status: 'success',
      data: pricingTable,
    };
  }

  @TypedRoute.Post('/')
  async createPricingTable(
    @TypedBody() dto: PricingTableCreateDto,
  ): Promise<ResponseDto<PricingTableDto>> {
    this.logger.debug(dto);

    const shop = await this.shopService.findBy({ id: dto.shopId });

    if (!shop) {
      throw new EntityNotfoundException({
        message: `Shop not found`,
      });
    }

    const pricingTable = await this.pricingTableService.createPricingTable(dto);

    return {
      status: 'success',
      data: pricingTable,
    };
  }
}
