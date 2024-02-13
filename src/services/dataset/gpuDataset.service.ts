import { Injectable, Logger } from '@nestjs/common';
import {
  IGpuDataset,
  IGpuDatasetCreate,
  IGpuDatasetQuery,
} from '../../interfaces/dataset/gpuDataset.interfaces';
import { GpuDatasetRepository } from '../../repositories/dataset/gpuDataset.repository';
import { GpuPricingRepository } from '../../repositories/shop/gpuPricing.repository';
import { IDatasetPricingCreate } from '../../interfaces/shop/pricingTable.interface';
import { KoreaCrawlingService } from '../crawling/koreaCrawling.service';
import * as cheerio from 'cheerio';
import { normalizeNvidiaGpu } from '../../utils/brand/gpu/nvidiaGpu.util';
import { IGpuPricingCreate } from '../../interfaces/shop/gpuPricing.interfaces';
import { normalizeAmdGpu } from '../../utils/brand/gpu/amdGpu.util';

@Injectable()
export class GpuDatasetService {
  private readonly logger = new Logger(GpuDatasetService.name);

  constructor(
    private readonly koCrawlingService: KoreaCrawlingService,
    private readonly gpuDatasetRepository: GpuDatasetRepository,
    private readonly gpuDatasetPricingTableRepository: GpuPricingRepository,
  ) {}

  async createAmdGpuTable(dto: Pick<IDatasetPricingCreate, 'shopId'>) {
    const amdGpuUrlQueries = [
      { ctgry_no1: '14', ctgry_no2: '59', ctgry_no3: '4146' }, // Radeon rx7000 series
      { ctgry_no1: '14', ctgry_no2: '59', ctgry_no3: '4085' }, // Radeon rx6000 series
      { ctgry_no1: '14', ctgry_no2: '59', ctgry_no3: '3902' }, // Radeon rx500 series
      { ctgry_no1: '14', ctgry_no2: '59', ctgry_no3: '3901' }, // Radeon rx400 series
      { ctgry_no1: '14', ctgry_no2: '59', ctgry_no3: '74' }, // ATI R'n' 400 under series
    ];

    const htmls = await Promise.all(
      amdGpuUrlQueries.map((query) =>
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
              const gpu = normalizeAmdGpu({
                category,
                name: product,
                priceString,
              });
              const createDto: IGpuPricingCreate = {
                datasetCreateDto: {
                  category: gpu.normalizedCategory,
                  normalizedHwKey: gpu.normalizedName,
                  vendor: 'amd',
                  metadata: $(element).html()?.trim() ?? null,
                },
                pricingTableRowCreateDto: {
                  type: 'GPU',
                  shopId: dto.shopId,
                  price: gpu.normalizedPrice,
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
        this.gpuDatasetPricingTableRepository.create({
          ...pricingTableRowCreateDto,
          datasetId: dataset.id,
        }),
      ),
    );

    return { datasets, pricingTableRows };
  }

  async createNvidiaGpuTable(dto: Pick<IDatasetPricingCreate, 'shopId'>) {
    // Todo: extract
    const nvidiaGpuUrlQueriesGpuUrlQueries = [
      { ctgry_no1: '14', ctgry_no2: '58', ctgry_no3: '4145' }, // RTX 4000 series
      { ctgry_no1: '14', ctgry_no2: '58', ctgry_no3: '4075' }, // RTX 3000 series
      { ctgry_no1: '14', ctgry_no2: '58', ctgry_no3: '3808' }, // RTX 2000 series
      { ctgry_no1: '14', ctgry_no2: '58', ctgry_no3: '3768' }, // GTX 1000 series
      { ctgry_no1: '14', ctgry_no2: '58', ctgry_no3: '3775' }, // GTX 900 series
      { ctgry_no1: '14', ctgry_no2: '58', ctgry_no3: '3784' }, // GTX 700 series
      { ctgry_no1: '14', ctgry_no2: '58', ctgry_no3: '3794' }, // GTX 600 series
      { ctgry_no1: '14', ctgry_no2: '58', ctgry_no3: '3807' }, // GTX 500 series
      { ctgry_no1: '14', ctgry_no2: '58', ctgry_no3: '72' }, // GTX 499 under series & GT series
    ];

    const htmls = await Promise.all(
      nvidiaGpuUrlQueriesGpuUrlQueries.map((query) =>
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
              const gpu = normalizeNvidiaGpu({
                category,
                name: product,
                priceString,
              });
              const createDto: IGpuPricingCreate = {
                datasetCreateDto: {
                  category: gpu.normalizedCategory,
                  normalizedHwKey: gpu.normalizedName,
                  vendor: 'nvidia',
                  metadata: $(element).html()?.trim() ?? null,
                },
                pricingTableRowCreateDto: {
                  type: 'GPU',
                  shopId: dto.shopId,
                  price: gpu.normalizedPrice,
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
        this.gpuDatasetPricingTableRepository.create({
          ...pricingTableRowCreateDto,
          datasetId: dataset.id,
        }),
      ),
    );

    return { datasets, pricingTableRows };
  }

  async createDatasetIfNotExist(
    dto: IGpuDatasetCreate,
    pricingTableRowCreateDto: Omit<IDatasetPricingCreate, 'datasetId'>, // bypass for parallel async
  ) {
    const exist = await this.findGpuDatasetBy(dto);
    if (exist) return { dataset: exist, pricingTableRowCreateDto };

    const dataset = await this.createGpuDataset(dto);
    return { dataset, pricingTableRowCreateDto };
  }

  async findGpuDatasetBy(query: IGpuDatasetQuery): Promise<IGpuDataset | null> {
    return this.gpuDatasetRepository.findBy(query);
  }

  async createGpuDataset(dto: IGpuDatasetCreate): Promise<IGpuDataset> {
    return this.gpuDatasetRepository.create(dto);
  }

  async upsert(dto: IGpuDatasetCreate): Promise<IGpuDataset> {
    return this.gpuDatasetRepository.upsert(dto);
  }
}
