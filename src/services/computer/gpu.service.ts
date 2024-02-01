import { Injectable, Logger } from '@nestjs/common';
import { GpuRepository } from '../../repositories/computer/gpu.repository';
import {
  IGpu,
  IGpuCreate,
  IGpuQuery,
} from '../../interfaces/computer/gpu.interface';

@Injectable()
export class GpuService {
  private readonly logger = new Logger(GpuService.name);
  constructor(private readonly gpuRepository: GpuRepository) {}

  async findBy(query: IGpuQuery): Promise<IGpu | null> {
    return this.gpuRepository.findBy(query);
  }

  async create(dto: IGpuCreate): Promise<IGpu> {
    return this.gpuRepository.create(dto);
  }

  async createIfNotExists(dto: IGpuCreate): Promise<IGpu> {
    const gpu = await this.gpuRepository.findBy({ hwKey: dto.hwKey });

    if (gpu) return gpu;

    return this.gpuRepository.createIfNotExist(dto);
  }
}
