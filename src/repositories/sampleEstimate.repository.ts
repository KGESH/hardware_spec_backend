import { BaseRepository } from './base.repository';
import {
  SampleEstimateCreateDto,
  SampleEstimateDto,
  SampleEstimateQueryDto,
  SampleEstimateUpdateDto,
} from '../dtos/estimate/sampleEstimate.dto';
import { sample_estimate } from '@prisma/client';
import { PrismaService } from '../services/prisma.service';
import { Logger } from '@nestjs/common';
import { v4 as uuidV4 } from 'uuid';

export class SampleEstimateRepository extends BaseRepository<
  sample_estimate,
  SampleEstimateDto
> {
  private readonly logger = new Logger(SampleEstimateRepository.name);

  constructor(private readonly prisma: PrismaService) {
    super();
  }

  protected _transform(sampleEstimate: sample_estimate): SampleEstimateDto {
    return {
      id: sampleEstimate.id,
      sheets: sampleEstimate.sheets,
      createdAt: sampleEstimate.created_at.toISOString(),
      updatedAt: sampleEstimate.updated_at.toISOString(),
      deletedAt: sampleEstimate.deleted_at?.toISOString(),
    };
  }

  async findBy(
    query: SampleEstimateQueryDto,
  ): Promise<SampleEstimateDto | null> {
    try {
      const sampleEstimate =
        await this.prisma.sample_estimate.findUniqueOrThrow({
          where: query,
        });

      this.logger.debug(sampleEstimate);

      return this._transform(sampleEstimate);
    } catch (e) {
      return this._handlePrismaNotFoundError(e, `SampleEstimate not found.`);
    }
  }

  async create(dto: SampleEstimateCreateDto): Promise<SampleEstimateDto> {
    try {
      const created = await this.prisma.sample_estimate.create({
        data: {
          id: uuidV4(),
          ...dto,
        },
      });

      this.logger.debug(created);

      return this._transform(created);
    } catch (e) {
      this._handlePrismaError(e);
    }
  }

  async update(dto: SampleEstimateUpdateDto): Promise<SampleEstimateDto> {
    try {
      const updated = await this.prisma.sample_estimate.update({
        where: { id: dto.id },
        data: {
          ...dto,
        },
      });

      this.logger.debug(updated);

      return this._transform(updated);
    } catch (e) {
      this._handlePrismaError(e);
    }
  }

  async delete(query: SampleEstimateQueryDto): Promise<boolean> {
    try {
      const deleted = await this.prisma.sample_estimate.delete({
        where: query,
      });

      this.logger.debug(deleted);

      return !!deleted;
    } catch (e) {
      this._handlePrismaError(e);
    }
  }
}
