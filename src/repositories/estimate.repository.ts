import { Injectable, Logger } from '@nestjs/common';
import { BaseRepository } from './base.repository';
import { PrismaService } from '../services/prisma.service';
import {
  EstimateCreateDto,
  EstimateDto,
  EstimateQueryDto,
  EstimateUpdateDto,
} from '../dtos/estimate/estimate.dto';
import { estimate } from '@prisma/client';
import { v4 as uuidV4 } from 'uuid';

@Injectable()
export class EstimateRepository extends BaseRepository<estimate, EstimateDto> {
  private readonly logger = new Logger(EstimateRepository.name);

  constructor(private readonly prisma: PrismaService) {
    super();
  }

  protected _transform(estimate: estimate): EstimateDto {
    return {
      id: estimate.id,
      name: estimate.name,
      cpuId: estimate.cpu_id,
      createdAt: estimate.created_at.toISOString(),
      updatedAt: estimate.updated_at.toISOString(),
      deletedAt: estimate.deleted_at?.toISOString(),
    };
  }

  async findBy(query: EstimateQueryDto): Promise<EstimateDto | null> {
    try {
      const estimate = await this.prisma.estimate.findUniqueOrThrow({
        where: query,
      });

      this.logger.debug(estimate);

      return this._transform(estimate);
    } catch (e) {
      return this._handlePrismaNotFoundError(e, `Estimate not found.`);
    }
  }

  async findMany(): Promise<EstimateDto[]> {
    try {
      const estimates = await this.prisma.estimate.findMany();
      return estimates.map((estimate) => this._transform(estimate));
    } catch (e) {
      this._handlePrismaError(e);
    }
  }

  async create(dto: EstimateCreateDto): Promise<EstimateDto> {
    try {
      const created = await this.prisma.estimate.create({
        data: {
          id: uuidV4(),
          name: dto.name,
          cpu_id: dto.cpuId,
        },
      });

      this.logger.debug(created);

      return this._transform(created);
    } catch (e) {
      this._handlePrismaError(e, `Estimate already exists.`);
    }
  }

  async update(dto: EstimateUpdateDto): Promise<EstimateDto> {
    try {
      const updated = await this.prisma.estimate.update({
        where: { id: dto.id },
        data: dto,
      });

      this.logger.debug(updated);

      return this._transform(updated);
    } catch (e) {
      this._handlePrismaError(e);
    }
  }

  async delete(id: string): Promise<boolean> {
    try {
      const deleted = await this.prisma.estimate.update({
        where: { id },
        data: { deleted_at: new Date() },
      });

      this.logger.debug(deleted);

      return true;
    } catch (e) {
      this._handlePrismaError(e);
    }
  }
}
