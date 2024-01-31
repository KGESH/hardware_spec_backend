import { Controller, Logger } from '@nestjs/common';
import { KoreaCrawlingService } from '../services/crawling/koreaCrawling.service';
import { TypedBody, TypedRoute } from '@nestia/core';
import { PricingTableService } from '../services/shop/pricingTable.service';
import { PricingTableCrawlingDto } from '../dtos/crawling/pricingTableCrawling.dto';

@Controller('crawling')
export class CrawlingController {
  private readonly logger = new Logger(CrawlingController.name);

  constructor(
    private readonly crawlingService: KoreaCrawlingService,
    private readonly pricingTableService: PricingTableService,
  ) {}

  @TypedRoute.Post('/')
  async getSamplePage(
    @TypedBody() dto: PricingTableCrawlingDto[],
  ): Promise<unknown> {
    this.logger.debug('getSamplePage');
    const pricingTableCreateDto = await this.crawlingService.crawlingPage(dto);

    this.logger.verbose(pricingTableCreateDto);

    return await this.pricingTableService.createPricingTable(
      pricingTableCreateDto,
    );
  }
}
