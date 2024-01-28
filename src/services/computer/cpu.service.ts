import { Injectable, Logger } from '@nestjs/common';
import { CpuRepository } from '../../repositories/computer/cpu.repository';
import {
  ICpu,
  ICpuCreate,
  ICpuQuery,
} from '../../interfaces/computer/cpu.interface';

@Injectable()
export class CpuService {
  private readonly logger = new Logger(CpuService.name);
  constructor(private readonly cpuRepository: CpuRepository) {}

  async findBy(query: ICpuQuery): Promise<ICpu | null> {
    return this.cpuRepository.findBy(query);
  }

  async create(dto: ICpuCreate): Promise<ICpu> {
    return this.cpuRepository.create(dto);
  }

  async createIfNotExists(dto: ICpuCreate): Promise<ICpu> {
    const cpu = await this.cpuRepository.findBy({ hwKey: dto.hwKey });

    if (cpu) return cpu;

    return this.cpuRepository.create(dto);
  }
}
