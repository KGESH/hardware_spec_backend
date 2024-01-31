import { Module } from '@nestjs/common';
import { KoreaCrawlingModule } from './koreaCrawling.module';
import { CrawlingController } from '../../controllers/crawling.controller';
import { PricingTableModule } from '../shop/pricingTable.module';

@Module({
  imports: [PricingTableModule, KoreaCrawlingModule],
  controllers: [CrawlingController],
})
export class CrawlingModule {}
