import { Injectable, Logger } from '@nestjs/common';
import { BaseRepository } from '../base.repository';
import { PrismaService } from '../../services/infra/prisma.service';
import { estimate } from '@prisma/client';
import {
  IEstimate,
  IEstimateCreate,
  IEstimateQuery,
  IEstimateUpdate,
} from '../../interfaces/estimate/estimate.interface';
import { v4 as uuidV4 } from 'uuid';

@Injectable()
export class EstimateRepository extends BaseRepository<estimate, IEstimate> {
  private readonly logger = new Logger(EstimateRepository.name);

  constructor(private readonly prisma: PrismaService) {
    super();
  }

  protected _transform(estimate: estimate): IEstimate {
    return {
      id: estimate.id,
      status: estimate.status,
      name: estimate.name,
      parts: [],
    };
  }

  async findBy({ id }: IEstimateQuery): Promise<IEstimate | null> {
    try {
      this.logger.verbose(`[Repository ]Find By`, id);
      const estimate = await this.prisma.estimate.findUniqueOrThrow({
        where: { id },
      });

      this.logger.debug(estimate);

      return this._transform(estimate);
    } catch (e) {
      this.logger.verbose(`[Repository ]Find By`, e);
      return this._handlePrismaNotFoundError(e, `Estimate not found!!.`);
    }
  }

  async findMany(): Promise<IEstimate[]> {
    try {
      const estimates = await this.prisma.estimate.findMany();
      return estimates.map((estimate) => this._transform(estimate));
    } catch (e) {
      this._handlePrismaError(e);
    }
  }

  async create(dto: IEstimateCreate): Promise<IEstimate> {
    try {
      const created = await this.prisma.estimate.create({
        data: {
          id: uuidV4(),
          status: dto.status,
          name: dto.name,
        },
      });

      this.logger.debug(created);

      return this._transform(created);
    } catch (e) {
      this._handlePrismaError(e, `Estimate already exists.`);
    }
  }

  async update(dto: IEstimateUpdate): Promise<IEstimate> {
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
