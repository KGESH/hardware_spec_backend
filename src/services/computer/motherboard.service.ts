import { Injectable, Logger } from '@nestjs/common';
import { MotherboardRepository } from '../../repositories/computer/motherboard.repository';
import {
  IMotherboard,
  IMotherboardCreate,
  IMotherboardQuery,
} from '../../interfaces/computer/motherboard.interface';

@Injectable()
export class MotherboardService {
  private readonly logger = new Logger(MotherboardService.name);
  constructor(private readonly motherboardRepository: MotherboardRepository) {}

  async findBy(query: IMotherboardQuery): Promise<IMotherboard | null> {
    return this.motherboardRepository.findBy(query);
  }

  async create(dto: IMotherboardCreate): Promise<IMotherboard> {
    return this.motherboardRepository.create(dto);
  }

  async createIfNotExists(dto: IMotherboardCreate): Promise<IMotherboard> {
    const motherboard = await this.motherboardRepository.findBy({
      hwKey: dto.hwKey,
    });

    if (motherboard) return motherboard;

    return this.motherboardRepository.createIfNotExist(dto);
  }
}
