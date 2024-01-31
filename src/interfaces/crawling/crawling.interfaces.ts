import { IPricingTableCreate } from '../shop/pricingTable.interface';
import { IPricingTableCrawling } from './pricingTableCrawling.interfaces';

export abstract class ICrawlingService {
  abstract getHTML(query: IPricingTableCrawling): Promise<string>;

  abstract parseHTML(html: string): string;
}
