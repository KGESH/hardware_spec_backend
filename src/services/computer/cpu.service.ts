import { Injectable, Logger } from '@nestjs/common';
import { CpuRepository } from '../../repositories/computer/cpu.repository';
import {
  ICpu,
  ICpuCreate,
  ICpuQuery,
  ICpuVendor,
} from '../../interfaces/computer/cpu.interface';
import { IHardware } from '../../interfaces/computer/hardware.interface';
import { normalizeIntelCpuName } from '../../utils/brand/cpu/intelCpu.util';
import { normalizeAmdCpuName } from '../../utils/brand/cpu/amdCpu.util';
import { UnknownException } from '../../exceptions/unknown.exception';
import * as typia from 'typia';

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
    const vendor = this._checkCpuVendor(dto.vendorName);

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

  private _checkCpuVendor(vendorName: string): ICpuVendor {
    const vendor = vendorName.toLowerCase();
    const isIntel = typia.is<'intel'>(vendor);
    const isAmd = typia.is<'amd'>(vendor);

    if (!isIntel && !isAmd) {
      throw new UnknownException({ message: `Unknown CPU vendor: ${vendor}` });
    }

    if (isIntel) {
      return 'intel';
    } else {
      return 'amd';
    }
  }
}
