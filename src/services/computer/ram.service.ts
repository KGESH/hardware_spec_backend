import { Injectable, Logger } from '@nestjs/common';
import { RamRepository } from '../../repositories/computer/ram.repository';
import {
  IRam,
  IRamCreate,
  IRamQuery,
} from '../../interfaces/computer/ram.interface';

@Injectable()
export class RamService {
  private readonly logger = new Logger(RamService.name);
  constructor(private readonly ramRepository: RamRepository) {}

  async findBy(query: IRamQuery): Promise<IRam | null> {
    return this.ramRepository.findBy(query);
  }

  async create(dto: IRamCreate): Promise<IRam> {
    return this.ramRepository.create(dto);
  }

  async createIfNotExists(dto: IRamCreate): Promise<IRam> {
    const ram = await this.ramRepository.findBy({ hwKey: dto.hwKey });

    if (ram) return ram;

    return this.ramRepository.create(dto);
  }
}
