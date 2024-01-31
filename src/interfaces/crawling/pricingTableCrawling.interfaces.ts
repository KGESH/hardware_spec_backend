import { IPricingTableCreate } from '../shop/pricingTable.interface';

export type IPricingTableCrawling = {
  path: string;
  params?: Record<string, string>;
} & Pick<IPricingTableCreate, 'shopId' | 'type'>;
