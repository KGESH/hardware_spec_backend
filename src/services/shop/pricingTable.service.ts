import { Injectable, Logger } from '@nestjs/common';
import { CpuPricingTableRepository } from '../../repositories/shop/cpuPricingTable.repository';
import {
  IPricingTable,
  IPricingTableCreate,
  IPricingTableQuery,
} from '../../interfaces/shop/pricingTable.interface';
import { UnknownException } from '../../exceptions/unknown.exception';
import { GpuPricingTableRepository } from '../../repositories/shop/gpuPricingTable.repository';
import { MotherboardPricingTableRepository } from '../../repositories/shop/motherboardPricingTable.repository';
import { RamPricingTableRepository } from '../../repositories/shop/ramPricingTable.repository';
import { DiskPricingTableRepository } from '../../repositories/shop/diskPricingTable.repository';

@Injectable()
export class PricingTableService {
  private readonly logger = new Logger(PricingTableService.name);

  constructor(
    private readonly cpuPricingTableRepository: CpuPricingTableRepository,
    private readonly gpuPricingTableRepository: GpuPricingTableRepository,
    private readonly motherboardPricingTableRepository: MotherboardPricingTableRepository,
    private readonly ramPricingTableRepository: RamPricingTableRepository,
    private readonly diskPricingTableRepository: DiskPricingTableRepository,
  ) {}

  async findPricingTable(
    query: IPricingTableQuery,
  ): Promise<IPricingTable | null> {
    switch (query.type) {
      case 'CPU':
        return this.cpuPricingTableRepository.findBy(query);

      case 'GPU':
        return this.gpuPricingTableRepository.findBy(query);

      case 'MB':
        return this.motherboardPricingTableRepository.findBy(query);

      case 'RAM':
        return this.ramPricingTableRepository.findBy(query);

      case 'DISK':
        return this.diskPricingTableRepository.findBy(query);

      default:
        throw new UnknownException('Unknown pricing table type');
    }
  }

  async createPricingTable(dto: IPricingTableCreate): Promise<IPricingTable> {
    switch (dto.type) {
      case 'CPU':
        return this.cpuPricingTableRepository.create(dto);

      case 'GPU':
        return this.gpuPricingTableRepository.create(dto);

      case 'MB':
        return this.motherboardPricingTableRepository.create(dto);

      case 'RAM':
        return this.ramPricingTableRepository.create(dto);

      case 'DISK':
        return this.diskPricingTableRepository.create(dto);

      default:
        throw new UnknownException('Unknown pricing table type');
    }
  }
}
