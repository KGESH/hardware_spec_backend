import { Injectable, Logger } from '@nestjs/common';
import {
  ICpuDataset,
  ICpuDatasetCreate,
  ICpuDatasetQuery,
} from '../../interfaces/dataset/cpuDataset.interfaces';
import { CpuDatasetRepository } from '../../repositories/dataset/cpuDataset.repository';
import { CpuPricingRepository } from '../../repositories/shop/cpuPricing.repository';
import { IDatasetPricingCreate } from '../../interfaces/shop/pricingTable.interface';
import { KoreaCrawlingService } from '../crawling/koreaCrawling.service';
import * as cheerio from 'cheerio';
import { normalizeAmdCpu } from '../../utils/brand/cpu/amdCpu.util';
import { normalizeIntelCpu } from '../../utils/brand/cpu/intelCpu.util';
import { ICpuPricingCreate } from '../../interfaces/shop/cpuPricing.interfaces';

@Injectable()
export class CpuDatasetService {
  private readonly logger = new Logger(CpuDatasetService.name);

  constructor(
    private readonly koCrawlingService: KoreaCrawlingService,
    private readonly cpuDatasetRepository: CpuDatasetRepository,
    private readonly cpuDatasetPricingTableRepository: CpuPricingRepository,
  ) {}

  async createAmdCpuTable(dto: Pick<IDatasetPricingCreate, 'shopId'>) {
    const amdCpuUrlQueries = [
      { ctgry_no1: '8', ctgry_no2: '2', ctgry_no3: '4138' },
      { ctgry_no1: '8', ctgry_no2: '2', ctgry_no3: '4072' },
      { ctgry_no1: '8', ctgry_no2: '2', ctgry_no3: '30' },
      { ctgry_no1: '8', ctgry_no2: '2', ctgry_no3: '3945' },
      { ctgry_no1: '8', ctgry_no2: '2', ctgry_no3: '3943' },
      { ctgry_no1: '8', ctgry_no2: '2', ctgry_no3: '1792' },
      { ctgry_no1: '8', ctgry_no2: '2', ctgry_no3: '1236' },
      { ctgry_no1: '8', ctgry_no2: '2', ctgry_no3: '1012' },
      { ctgry_no1: '8', ctgry_no2: '2', ctgry_no3: '1235' },
      { ctgry_no1: '8', ctgry_no2: '2', ctgry_no3: '29' },
    ];

    const htmls = await Promise.all(
      amdCpuUrlQueries.map((query) =>
        this.koCrawlingService.getHTML({
          path: '/price/computer.do',
          params: query,
        }),
      ),
    );

    const rows = htmls.flatMap((html) => {
      const $ = cheerio.load(html);
      const tRows = $('table tbody tr');
      return tRows
        .map((idx, element) => {
          if (idx !== 0) {
            // Use the index of <td> to access column data
            const tds = $(element).find('td');
            const category = $(tds[0]).text().trim(); // First <td>
            const product = $(tds[1]).text().trim(); // Second <td>
            const priceString = $(tds[2]).text().trim(); // Third <td>

            // Skip the information row
            if (!priceString.startsWith('0')) {
              const cpu = normalizeAmdCpu({
                category,
                name: product,
                priceString,
              });
              const createDto: ICpuPricingCreate = {
                datasetCreateDto: {
                  category: cpu.normalizedCategory,
                  normalizedHwKey: cpu.normalizedName,
                  vendor: 'amd',
                  metadata: $(element).html()?.trim() ?? null,
                },
                pricingTableRowCreateDto: {
                  type: 'CPU',
                  shopId: dto.shopId,
                  price: cpu.normalizedPrice,
                },
              };
              return createDto;
            }
          }
        })
        .toArray();
    });

    const datasets = await Promise.all(
      rows.map(({ datasetCreateDto, pricingTableRowCreateDto }) =>
        this.createDatasetIfNotExist(
          datasetCreateDto,
          pricingTableRowCreateDto,
        ),
      ),
    );

    const pricingTableRows = await Promise.all(
      datasets.map(({ dataset, pricingTableRowCreateDto }) =>
        this.cpuDatasetPricingTableRepository.create({
          ...pricingTableRowCreateDto,
          datasetId: dataset.id,
        }),
      ),
    );

    return { datasets, pricingTableRows };
  }

  async createIntelCpuTable(dto: Pick<IDatasetPricingCreate, 'shopId'>) {
    // Todo: extract
    const intelCpuUrlQueries = [
      { ctgry_no1: '8', ctgry_no2: '9', ctgry_no3: '4144' },
      { ctgry_no1: '8', ctgry_no2: '9', ctgry_no3: '4137' },
      { ctgry_no1: '8', ctgry_no2: '9', ctgry_no3: '4089' },
      { ctgry_no1: '8', ctgry_no2: '9', ctgry_no3: '4083' },
      { ctgry_no1: '8', ctgry_no2: '9', ctgry_no3: '4020' },
      { ctgry_no1: '8', ctgry_no2: '9', ctgry_no3: '25' },
      { ctgry_no1: '8', ctgry_no2: '9', ctgry_no3: '3918' },
      { ctgry_no1: '8', ctgry_no2: '9', ctgry_no3: '3838' },
      { ctgry_no1: '8', ctgry_no2: '9', ctgry_no3: '3682' },
      { ctgry_no1: '8', ctgry_no2: '9', ctgry_no3: '3681' },
      { ctgry_no1: '8', ctgry_no2: '9', ctgry_no3: '1684' },
      { ctgry_no1: '8', ctgry_no2: '9', ctgry_no3: '1188' },
      { ctgry_no1: '8', ctgry_no2: '9', ctgry_no3: '993' },
      { ctgry_no1: '8', ctgry_no2: '9', ctgry_no3: '31' },
      { ctgry_no1: '8', ctgry_no2: '9', ctgry_no3: '3652' },
      { ctgry_no1: '8', ctgry_no2: '9', ctgry_no3: '3584' },
      { ctgry_no1: '8', ctgry_no2: '9', ctgry_no3: '3583' },
    ];

    const htmls = await Promise.all(
      intelCpuUrlQueries.map((query) =>
        this.koCrawlingService.getHTML({
          path: '/price/computer.do',
          params: query,
        }),
      ),
    );

    const rows = htmls.flatMap((html) => {
      const $ = cheerio.load(html);
      const tRows = $('table tbody tr');
      return tRows
        .map((idx, element) => {
          if (idx !== 0) {
            // Use the index of <td> to access column data
            const tds = $(element).find('td');
            const category = $(tds[0]).text().trim(); // First <td>
            const product = $(tds[1]).text().trim(); // Second <td>
            const priceString = $(tds[2]).text().trim(); // Third <td>

            // Skip the information row
            if (!priceString.startsWith('0')) {
              const cpu = normalizeIntelCpu({
                category,
                name: product,
                priceString,
              });
              const createDto: ICpuPricingCreate = {
                datasetCreateDto: {
                  category: cpu.normalizedCategory,
                  normalizedHwKey: cpu.normalizedName,
                  vendor: 'intel',
                  metadata: $(element).html()?.trim() ?? null,
                },
                pricingTableRowCreateDto: {
                  type: 'CPU',
                  shopId: dto.shopId,
                  price: cpu.normalizedPrice,
                },
              };
              return createDto;
            }
          }
        })
        .toArray();
    });

    const datasets = await Promise.all(
      rows.map(({ datasetCreateDto, pricingTableRowCreateDto }) =>
        this.createDatasetIfNotExist(
          datasetCreateDto,
          pricingTableRowCreateDto,
        ),
      ),
    );

    const pricingTableRows = await Promise.all(
      datasets.map(({ dataset, pricingTableRowCreateDto }) =>
        this.cpuDatasetPricingTableRepository.create({
          ...pricingTableRowCreateDto,
          datasetId: dataset.id,
        }),
      ),
    );

    return { datasets, pricingTableRows };
  }

  async createDatasetIfNotExist(
    dto: ICpuDatasetCreate,
    pricingTableRowCreateDto: Omit<IDatasetPricingCreate, 'datasetId'>, // bypass for parallel async
  ) {
    const exist = await this.findCpuDatasetBy(dto);
    if (exist) return { dataset: exist, pricingTableRowCreateDto };

    const dataset = await this.createCpuDataset(dto);
    return { dataset, pricingTableRowCreateDto };
  }

  async findCpuDatasetBy(query: ICpuDatasetQuery): Promise<ICpuDataset | null> {
    return this.cpuDatasetRepository.findBy(query);
  }

  async createCpuDataset(dto: ICpuDatasetCreate): Promise<ICpuDataset> {
    return this.cpuDatasetRepository.create(dto);
  }

  async upsert(dto: ICpuDatasetCreate): Promise<ICpuDataset> {
    return this.cpuDatasetRepository.upsert(dto);
  }
}
