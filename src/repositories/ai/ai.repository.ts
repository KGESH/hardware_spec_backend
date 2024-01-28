import { Injectable, Logger } from '@nestjs/common';
import { BaseRepository } from '../base.repository';
import { ai_answer } from '@prisma/client';
import { PrismaService } from '../../services/infra/prisma.service';
import { v4 as uuidV4 } from 'uuid';
import {
  IAIAnswer,
  IAIAnswerCreate,
} from '../../interfaces/ai/aiAnswer.interface';
@Injectable()
export class AIRepository extends BaseRepository<ai_answer, IAIAnswer> {
  private readonly logger = new Logger(AIRepository.name);

  constructor(private readonly prisma: PrismaService) {
    super();
  }

  protected _transform(entity: ai_answer): IAIAnswer {
    return {
      id: entity.id,
      name: entity.name,
      tablePrice: entity.table_price,
      buyingPrice: entity.buying_price,
      currency: entity.currency,
      metadata: entity.metadata,
    };
  }

  async create(dto: IAIAnswerCreate): Promise<IAIAnswer> {
    try {
      const aiAnswer = await this.prisma.ai_answer.create({
        data: {
          id: uuidV4(),
          name: dto.name,
          table_price: dto.tablePrice,
          buying_price: dto.buyingPrice,
          currency: dto.currency,
          metadata: dto.metadata,
        },
      });
      return this._transform(aiAnswer);
    } catch (e) {
      this._handlePrismaError(e, `Estimate already exists.`);
    }
  }
}
