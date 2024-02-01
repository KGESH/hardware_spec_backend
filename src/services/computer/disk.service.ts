import { Injectable, Logger } from '@nestjs/common';
import { DiskRepository } from '../../repositories/computer/disk.repository';
import {
  IDisk,
  IDiskCreate,
  IDiskQuery,
} from '../../interfaces/computer/disk.interface';

@Injectable()
export class DiskService {
  private readonly logger = new Logger(DiskService.name);
  constructor(private readonly diskRepository: DiskRepository) {}

  async findBy(query: IDiskQuery): Promise<IDisk | null> {
    return this.diskRepository.findBy(query);
  }

  async create(dto: IDiskCreate): Promise<IDisk> {
    return this.diskRepository.create(dto);
  }

  async createIfNotExists(dto: IDiskCreate): Promise<IDisk> {
    const disk = await this.diskRepository.findBy({ hwKey: dto.hwKey });

    if (disk) return disk;

    return this.diskRepository.createIfNotExist(dto);
  }
}
