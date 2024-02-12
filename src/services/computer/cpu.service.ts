import { Injectable, Logger } from '@nestjs/common';
import { CpuRepository } from '../../repositories/computer/cpu.repository';
import {
  ICpu,
  ICpuCreate,
  ICpuQuery,
} from '../../interfaces/computer/cpu.interface';
import { IHardware } from '../../interfaces/computer/hardware.interface';
import { normalizeIntelCpuName } from '../../utils/brand/cpu/intelCpu.util';
import { normalizeAmdCpuName } from '../../utils/brand/cpu/amdCpu.util';
import { checkCpuVendor } from '../../utils/brand/cpu/commonCpu.util';

@Injectable()
export class CpuService {
  private readonly logger = new Logger(CpuService.name);

  constructor(private readonly cpuRepository: CpuRepository) {}

  async findBy(query: ICpuQuery): Promise<ICpu | null> {
    return this.cpuRepository.findBy(query);
  }

  async create(dto: ICpuCreate): Promise<ICpu> {
    const { normalizedHwKey } = this._getNormalizeHwKey(dto);
    return this.cpuRepository.create(dto, normalizedHwKey);
  }

  async createIfNotExists(dto: ICpuCreate): Promise<ICpu> {
    const cpu = await this.cpuRepository.findBy({ hwKey: dto.hwKey });
    if (cpu) return cpu;

    return this.create(dto);
  }

  private _getNormalizeHwKey(
    dto: ICpuCreate,
  ): Pick<IHardware, 'normalizedHwKey'> {
    let normalizedHwKey: string;
    const vendor = checkCpuVendor(dto.vendorName);

    switch (vendor) {
      case 'intel':
        normalizedHwKey = normalizeIntelCpuName(dto.hwKey);
        break;
      case 'amd':
        normalizedHwKey = normalizeAmdCpuName(dto.hwKey);
        break;
    }

    return { normalizedHwKey };
  }
}
