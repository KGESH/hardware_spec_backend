import { Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { catchError, firstValueFrom, map } from 'rxjs';
import * as cheerio from 'cheerio';
import { ICrawlingService } from '../../interfaces/crawling/crawling.interfaces';
import { EntityNotfoundException } from '../../exceptions/entityNotfound.exception';
import { IPricingTableCreate } from '../../interfaces/shop/pricingTable.interface';
import { IPricingTableCrawling } from '../../interfaces/crawling/pricingTableCrawling.interfaces';

@Injectable()
export class KoreaCrawlingService implements ICrawlingService {
  private readonly logger = new Logger(KoreaCrawlingService.name);

  constructor(private readonly http: HttpService) {}

  getHTML(query: IPricingTableCrawling): Promise<string> {
    const html = this.http
      .get<string>(query.path, { params: query.params })
      .pipe(
        map((response) => response.data),
        catchError((err) => {
          this.logger.error(err);
          throw new EntityNotfoundException({
            message: 'crawling not found error',
            data: { query },
          });
        }),
      );

    return firstValueFrom(html);
  }

  parseHTML(html: string): string {
    const $ = cheerio.load(html);

    const table = $('table tbody');

    const sheets = table.html() || 'Table not found';

    this.logger.verbose(sheets);

    return sheets;
  }

  async crawlingPage(
    query: IPricingTableCrawling[],
  ): Promise<IPricingTableCreate> {
    let sheets = '';
    for (const queryElement of query) {
      const html = await this.getHTML(queryElement);

      const contents = this.parseHTML(html);

      sheets += contents;
    }

    const dto: IPricingTableCreate = {
      shopId: query[0].shopId,
      type: query[0].type,
      sheets,
    };

    return dto;
  }
}
