import { PricingTableCreateDto } from '../shop/pricing.table.dto';

export type PricingTableCrawlingDto = {
  path: string;
  params?: Record<string, string>;
} & Pick<PricingTableCreateDto, 'shopId' | 'type'>;
